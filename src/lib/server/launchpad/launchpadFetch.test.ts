import { beforeEach, describe, expect, it, vi } from "vitest";
import { launchpadFetch } from "./launchpadFetch.js";

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
  body = "",
  headers: Record<string, string> = {},
) {
  return {
    statusCode,
    headers,
    body: { text: async () => body, dump: async () => {} },
  };
}

beforeEach(() => {
  requestMock.mockReset();
  mockEnv.MAIN_LAUNCHPAD_BASE_HOST = "https://lp.example";
  delete mockEnv.MAIN_LAUNCHPAD_IP_ADDRESS;
  delete mockEnv.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY;
});

describe("launchpadFetch", () => {
  it("requests the URL as given and returns status and body", async () => {
    requestMock.mockResolvedValueOnce(undiciResponse(200, '{"ok":true}'));

    const response = await launchpadFetch(
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

    await launchpadFetch("https://lp.example/api/devel/ubuntu?ws.size=1");

    const [url, options] = requestMock.mock.calls[0];
    expect(url.toString()).toBe("https://10.0.0.7/api/devel/ubuntu?ws.size=1");
    expect(options.headers.host).toBe("lp.example");
  });

  it("leaves URLs for other hosts untouched", async () => {
    mockEnv.MAIN_LAUNCHPAD_IP_ADDRESS = "https://10.0.0.7";
    requestMock.mockResolvedValueOnce(undiciResponse(200));

    await launchpadFetch("https://elsewhere.example/path");

    const [url, options] = requestMock.mock.calls[0];
    expect(url.toString()).toBe("https://elsewhere.example/path");
    expect(options.headers.host).toBeUndefined();
  });

  it("does not follow redirects and exposes response headers", async () => {
    requestMock.mockResolvedValueOnce(
      undiciResponse(302, "", { location: "https://lp.example/moved" }),
    );

    const response = await launchpadFetch(
      "https://lp.example/api/devel/ubuntu",
    );

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://lp.example/moved");
  });

  it("skips TLS verification only when configured", async () => {
    requestMock.mockResolvedValueOnce(undiciResponse(200));
    await launchpadFetch("https://lp.example/");
    expect(requestMock.mock.calls[0][1].dispatcher).toBeUndefined();

    mockEnv.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY = "true";
    requestMock.mockResolvedValueOnce(undiciResponse(200));
    await launchpadFetch("https://lp.example/");
    expect(requestMock.mock.calls[1][1].dispatcher).toMatchObject({
      options: { connect: { rejectUnauthorized: false } },
    });
  });
});
