import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import type { AddressInfo } from "node:net";
import { createSecureContext } from "node:tls";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  launchpadTestCertificate,
  launchpadTestKey,
} from "../../../../test/launchpad-tls.fixtures.js";

type Env = typeof import("$app/env/private");

const mockEnv = vi.hoisted((): { -readonly [K in keyof Env]: Env[K] } => ({
  MAIN_LAUNCHPAD_BASE_HOST: "https://launchpad.invalid",
  MAIN_LAUNCHPAD_COOKIE_NAME: "lp",
  MAIN_LAUNCHPAD_IP_ADDRESS: undefined,
  MAIN_LAUNCHPAD_SKIP_TLS_VERIFY: false,
  TEST_OBSERVER_IMAGE_ARTIFACTS_URL:
    "https://observer.example/v1/artefacts?family=image",
}));
// TODO: Reduce repeated env mocks (https://warthogs.atlassian.net/browse/LP-5132)
vi.mock("$app/env/private", () => mockEnv);

const tlsOptions = {
  key: launchpadTestKey,
  cert: launchpadTestCertificate,
};
const serverNames: string[] = [];
let privateAddress: string;
let otherAddress: string;

function echo(
  request: IncomingMessage,
  response: ServerResponse,
  backend: string,
) {
  response.setHeader("content-type", "application/json");
  response.end(
    JSON.stringify({
      backend,
      host: request.headers.host,
      path: request.url,
      cookie: request.headers.cookie ?? null,
    }),
  );
}

const otherBackend = createHttpServer((request, response) => {
  echo(request, response, "other");
});
const backend = createHttpsServer(
  {
    ...tlsOptions,
    SNICallback(servername, callback) {
      serverNames.push(servername);
      callback(null, createSecureContext(tlsOptions));
    },
  },
  (request, response) => {
    const redirects: Record<string, string> = {
      "/api/devel/external": `${otherAddress}/outside`,
      "/api/devel/external-tls": `${privateAddress}/outside`,
    };
    const location = redirects[request.url ?? ""];
    if (location) {
      response.writeHead(302, { location }).end();
    } else {
      echo(request, response, "launchpad");
    }
  },
);

beforeAll(async () => {
  for (const instance of [backend, otherBackend]) {
    instance.listen(0, "127.0.0.1");
    await once(instance, "listening");
  }
  privateAddress = `https://127.0.0.1:${(backend.address() as AddressInfo).port}`;
  otherAddress = `http://127.0.0.1:${(otherBackend.address() as AddressInfo).port}`;
});

beforeEach(() => {
  vi.resetModules();
  serverNames.length = 0;
  mockEnv.MAIN_LAUNCHPAD_BASE_HOST = "https://launchpad.invalid";
  mockEnv.MAIN_LAUNCHPAD_IP_ADDRESS = privateAddress;
  mockEnv.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY = true;
});

afterAll(async () => {
  for (const instance of [backend, otherBackend]) {
    instance.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      instance.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

describe("Launchpad client transport configuration", () => {
  it("routes to the private server with the logical hostname, SNI and per-request cookies", async () => {
    const { launchpadClient } = await import("./client.js");
    const results = await Promise.all(
      ["first-user", "second-user", undefined].map((user) =>
        launchpadClient.distribution.get(
          { path: { distribution: "ubuntu" } },
          {
            headers: user ? { cookie: `launchpad_dev=${user}` } : undefined,
          },
        ),
      ),
    );
    expect(results.map(({ data }) => data)).toEqual(
      ["launchpad_dev=first-user", "launchpad_dev=second-user", null].map(
        (cookie) =>
          expect.objectContaining({
            backend: "launchpad",
            host: "launchpad.invalid",
            path: "/api/devel/ubuntu",
            cookie,
          }),
      ),
    );
    expect(serverNames).toContain("launchpad.invalid");
  });

  it("verifies the private server's certificate when verification is enabled", async () => {
    mockEnv.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY = false;
    const { launchpadClient } = await import("./client.js");
    await expect(
      launchpadClient.distribution.get({ path: { distribution: "ubuntu" } }),
    ).rejects.toMatchObject({
      cause: { code: "DEPTH_ZERO_SELF_SIGNED_CERT" },
    });
  });

  it("does not reroute other origins reached through a redirect", async () => {
    const { launchpadClient } = await import("./client.js");
    const { data } = await launchpadClient.project.get({
      path: { project: "external" },
    });
    expect(data).toMatchObject({
      backend: "other",
      host: new URL(otherAddress).host,
    });
  });

  it("does not disable certificate verification for a redirect to another origin", async () => {
    const { launchpadClient } = await import("./client.js");
    await expect(
      launchpadClient.project.get({ path: { project: "external-tls" } }),
    ).rejects.toMatchObject({
      cause: { code: "DEPTH_ZERO_SELF_SIGNED_CERT" },
    });
  });

  it("honors the internal address's protocol and port without changing the logical Host", async () => {
    mockEnv.MAIN_LAUNCHPAD_IP_ADDRESS = otherAddress;
    mockEnv.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY = false;
    const { launchpadClient } = await import("./client.js");
    const { data } = await launchpadClient.distribution.get({
      path: { distribution: "ubuntu" },
    });
    expect(data).toMatchObject({
      backend: "other",
      host: "launchpad.invalid",
      path: "/api/devel/ubuntu",
    });
  });
});
