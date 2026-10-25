import { Readable } from "node:stream";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { launchpadFetch, launchpadFetchStream } from "./launchpadFetch.js";

const mockEnv = vi.hoisted(
  () =>
    ({ MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example" }) as Record<
      string,
      string | undefined
    >,
);
vi.mock("$env/dynamic/private", () => ({ env: mockEnv }));

const requestMock = vi.hoisted(() => vi.fn());
vi.mock("undici", () => ({
  request: requestMock,
  Agent: class Agent {
    constructor(public readonly options: unknown) {}
  },
}));

function undiciResponse(
  statusCode: number,
  chunks: string[] = [],
  headers: Record<string, string | string[]> = {},
) {
  const body = Readable.from(
    chunks.map((chunk) => Buffer.from(chunk)),
    { objectMode: false },
  );
  return {
    statusCode,
    headers,
    body: Object.assign(body, { text: async () => chunks.join("") }),
  };
}

beforeEach(() => {
  requestMock.mockReset();
  mockEnv.MAIN_LAUNCHPAD_BASE_HOST = "https://lp.example";
  delete mockEnv.MAIN_LAUNCHPAD_IP_ADDRESS;
  delete mockEnv.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;
});

describe.each([
  ["launchpadFetch", launchpadFetch],
  ["launchpadFetchStream", launchpadFetchStream],
])("%s", (_name, fetchLaunchpad) => {
  it("requests the URL as given and returns status and body", async () => {
    requestMock.mockResolvedValueOnce(undiciResponse(200, ['{"ok":true}']));

    const response = await fetchLaunchpad(
      "https://lp.example/api/devel/ubuntu",
    );

    expect(requestMock.mock.calls[0][0].toString()).toBe(
      "https://lp.example/api/devel/ubuntu",
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("connects to the pinned IP with a Host override", async () => {
    mockEnv.MAIN_LAUNCHPAD_IP_ADDRESS = "https://10.0.0.7";
    requestMock.mockResolvedValueOnce(undiciResponse(200));

    await fetchLaunchpad("https://lp.example/api/devel/ubuntu?ws.size=1");

    const [url, options] = requestMock.mock.calls[0];
    expect(url.toString()).toBe("https://10.0.0.7/api/devel/ubuntu?ws.size=1");
    expect(options.headers.host).toBe("lp.example");
  });

  it("leaves URLs for other hosts untouched", async () => {
    mockEnv.MAIN_LAUNCHPAD_IP_ADDRESS = "https://10.0.0.7";
    requestMock.mockResolvedValueOnce(undiciResponse(200));

    await fetchLaunchpad("https://elsewhere.example/path");

    const [url, options] = requestMock.mock.calls[0];
    expect(url.toString()).toBe("https://elsewhere.example/path");
    expect(options.headers.host).toBeUndefined();
  });

  it("does not follow redirects and exposes response headers", async () => {
    requestMock.mockResolvedValueOnce(
      undiciResponse(302, [], { location: "https://lp.example/moved" }),
    );

    const response = await fetchLaunchpad(
      "https://lp.example/api/devel/ubuntu",
    );

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://lp.example/moved");
  });

  it("joins repeated header values", async () => {
    requestMock.mockResolvedValueOnce(
      undiciResponse(200, [], { "set-cookie": ["a=1", "b=2"] }),
    );

    const response = await fetchLaunchpad("https://lp.example/");

    expect(response.headers.get("set-cookie")).toBe("a=1, b=2");
  });

  it("skips TLS verification only when configured", async () => {
    requestMock.mockResolvedValueOnce(undiciResponse(200));
    await fetchLaunchpad("https://lp.example/");
    expect(requestMock.mock.calls[0][1].dispatcher).toBeUndefined();

    mockEnv.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY = "true";
    requestMock.mockResolvedValueOnce(undiciResponse(200));
    await fetchLaunchpad("https://lp.example/");
    expect(requestMock.mock.calls[1][1].dispatcher).toMatchObject({
      options: { connect: { rejectUnauthorized: false } },
    });
  });
});

describe("launchpadFetchStream", () => {
  it("streams the body chunks unchanged", async () => {
    requestMock.mockResolvedValueOnce(undiciResponse(200, ["ab", "cd"]));

    const response = await launchpadFetchStream(
      "https://lp.example/files/x.deb",
    );

    await expect(response.text()).resolves.toBe("abcd");
  });

  it("cancelling the body destroys the upstream stream", async () => {
    const upstream = undiciResponse(200, ["ab", "cd"]);
    requestMock.mockResolvedValueOnce(upstream);

    const response = await launchpadFetchStream(
      "https://lp.example/files/x.deb",
    );
    await response.body?.cancel();

    expect(upstream.body.destroyed).toBe(true);
  });
});
