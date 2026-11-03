import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import type { AddressInfo } from "node:net";
import { createSecureContext } from "node:tls";
import { http, passthrough } from "msw";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { server as mocks } from "$lib/api/packages/mocks/server.js";
import {
  launchpadTestCertificate,
  launchpadTestKey,
} from "../../../../test/launchpad-tls.fixtures.js";

const env = vi.hoisted(() => ({}) as Record<string, string | undefined>);
vi.mock("$env/dynamic/private", () => ({ env }));

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
  for (const key of Object.keys(env)) delete env[key];
  Object.assign(env, {
    MAIN_LAUNCHPAD_BASE_HOST: "https://launchpad.invalid",
    MAIN_LAUNCHPAD_IP_ADDRESS: privateAddress,
    MAIN_LAUNCHPAD_SKIP_TLS_VERIFY: "true",
  });
  // Exercise real sockets through the configured Fetch transport, not MSW replies.
  mocks.use(http.all("*", () => passthrough()));
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
    const { launchpadClient, launchpadApiBaseUrl } =
      await import("./client.js");
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
    expect(launchpadApiBaseUrl).toBe("https://launchpad.invalid/api/devel/");
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

  it("verifies the private server's certificate by default", async () => {
    delete env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;
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
    env.MAIN_LAUNCHPAD_IP_ADDRESS = otherAddress;
    delete env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;
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

describe("launchpadUrl", () => {
  it.each([
    [["ubuntu", "noble"], "ubuntu/noble"],
    [["~", "userl"], "~userl"],
    [["ubuntu", "+", "archive", "primary"], "ubuntu/+archive/primary"],
    [["~", "a/b c"], "~a%2Fb%20c"],
  ])("links %j under the configured API root", async (segments, path) => {
    const { launchpadUrl } = await import("./client.js");
    expect(launchpadUrl(...segments)).toBe(
      `https://launchpad.invalid/api/devel/${path}`,
    );
  });

  it.each([
    ["ubuntu", null],
    ["~", undefined],
  ])("returns undefined when a segment is missing: %j", async (...segments) => {
    const { launchpadUrl } = await import("./client.js");
    expect(launchpadUrl(...segments)).toBeUndefined();
  });

  it.each([".", ".."])(
    "rejects the dot segment %s instead of leaving the API root",
    async (segment) => {
      const { launchpadUrl } = await import("./client.js");
      expect(() => launchpadUrl(segment, "x")).toThrow(TypeError);
    },
  );
});
