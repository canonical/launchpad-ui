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

async function echo(
  request: IncomingMessage,
  response: ServerResponse,
  backend: string,
) {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  response.setHeader("content-type", "application/json");
  response.end(
    JSON.stringify({
      backend,
      host: request.headers.host,
      path: request.url,
      method: request.method,
      cookie: request.headers.cookie ?? null,
      authorization: request.headers.authorization ?? null,
      contentType: request.headers["content-type"],
      body: Buffer.concat(chunks).toString(),
    }),
  );
}

const otherBackend = createHttpServer((request, response) => {
  void echo(request, response, "other");
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
      "/api/devel/relative": "/api/devel/final?redirected=true",
      "/api/devel/external": `${otherAddress}/outside`,
      "/api/devel/external-tls": `${privateAddress}/outside`,
    };
    const location = redirects[request.url ?? ""];
    if (location) {
      response.writeHead(302, { location }).end();
    } else if (request.url !== "/api/devel/wait") {
      void echo(request, response, "launchpad");
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
  it("routes to the private server while preserving hostname, SNI, body and per-request cookies", async () => {
    const { launchpadClient, launchpadApiBaseUrl } =
      await import("./config.js");
    const results = await Promise.all(
      ["first-user", "second-user", undefined].map((user) =>
        launchpadClient.bug.patch(
          {
            path: { id: "1" },
            body: { title: "hello" },
          },
          {
            headers: user ? { cookie: `launchpad_dev=${user}` } : undefined,
          },
        ),
      ),
    );
    expect(launchpadApiBaseUrl).toBe("https://launchpad.invalid/api/devel/");
    expect(results.map(({ data }) => data)).toEqual(
      ["launchpad_dev=first-user", "launchpad_dev=second-user", null].map(
        (cookie) => ({
          backend: "launchpad",
          host: "launchpad.invalid",
          path: "/api/devel/bugs/1",
          method: "PATCH",
          cookie,
          authorization: null,
          contentType: "application/json",
          body: '{"title":"hello"}',
        }),
      ),
    );
    expect(serverNames).toContain("launchpad.invalid");
    expect(results[0].response.url).toBe(
      "https://launchpad.invalid/api/devel/bugs/1",
    );
  });

  it("verifies the private server's certificate by default", async () => {
    delete env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;
    const { launchpadClient } = await import("./config.js");
    await expect(
      launchpadClient.distribution.get({ path: { distribution: "ubuntu" } }),
    ).rejects.toMatchObject({
      cause: { code: "DEPTH_ZERO_SELF_SIGNED_CERT" },
    });
  });

  it("follows redirects with normal Fetch cookie isolation and origin-scoped routing", async () => {
    const { launchpadClient } = await import("./config.js");
    const headers = {
      cookie: "launchpad_dev=current-user",
      authorization: "Bearer test-credential",
    };
    const relative = await launchpadClient.project.get(
      { path: { project: "relative" } },
      { headers },
    );
    expect(relative.response.url).toBe(
      "https://launchpad.invalid/api/devel/final?redirected=true",
    );
    expect(relative.data).toMatchObject({
      backend: "launchpad",
      cookie: headers.cookie,
      authorization: headers.authorization,
    });
    const external = await launchpadClient.project.get(
      { path: { project: "external" } },
      { headers },
    );
    expect(external.response.url).toBe(`${otherAddress}/outside`);
    expect(external.data).toMatchObject({
      backend: "other",
      host: new URL(otherAddress).host,
      cookie: null,
      authorization: null,
    });
  });

  it("does not disable certificate verification for a redirect to another origin", async () => {
    const { launchpadClient } = await import("./config.js");
    await expect(
      launchpadClient.project.get({ path: { project: "external-tls" } }),
    ).rejects.toMatchObject({
      cause: { code: "DEPTH_ZERO_SELF_SIGNED_CERT" },
    });
  });

  it("honors the internal address's protocol and port without changing the logical Host", async () => {
    env.MAIN_LAUNCHPAD_IP_ADDRESS = otherAddress;
    delete env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;
    const { launchpadClient } = await import("./config.js");
    const { data, response } = await launchpadClient.distribution.get({
      path: { distribution: "ubuntu" },
    });
    expect(data).toMatchObject({
      backend: "other",
      host: "launchpad.invalid",
      path: "/api/devel/ubuntu",
    });
    expect(response.url).toBe("https://launchpad.invalid/api/devel/ubuntu");
  });

  it("preserves cancellation after a request reaches the private server", async () => {
    const { launchpadClient } = await import("./config.js");
    const controller = new AbortController();
    const arrived = once(backend, "request");
    const request = launchpadClient.project.get(
      { path: { project: "wait" } },
      { signal: controller.signal },
    );
    await Promise.race([arrived, request]);
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: "AbortError" });
  });
});
