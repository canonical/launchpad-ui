import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMe, getUbuntu } from "./connection-test.remote.js";

const { fetchMock, getRequestEvent } = vi.hoisted(() => {
  const fetchMock = vi.fn<(request: Request) => Promise<Response>>();
  vi.stubGlobal("fetch", fetchMock);
  return { fetchMock, getRequestEvent: vi.fn() };
});
vi.mock("$env/dynamic/private", () => ({
  env: {
    MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example",
    MAIN_LAUNCHPAD_COOKIE_NAME: "lp-session",
  },
}));
vi.mock("$app/server", () => ({
  query: (handler: () => unknown) =>
    Object.assign(handler, { __: { type: "query" } }),
  form: (_schema: unknown, handler: (args: unknown) => unknown) =>
    Object.assign(handler, { __: { type: "form" } }),
  getRequestEvent,
}));

beforeEach(() => {
  fetchMock
    .mockReset()
    .mockImplementation(async () => Response.json({ name: "example" }));
  getRequestEvent.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("connection diagnostics", () => {
  it("isolates concurrent users' cookies and leaves anonymous calls unauthenticated", async () => {
    getRequestEvent
      .mockReturnValueOnce({ cookies: { get: () => "user-one" } })
      .mockReturnValueOnce({ cookies: { get: () => "user-two" } })
      .mockReturnValueOnce({ cookies: { get: () => undefined } });
    const results = await Promise.all([getMe(), getMe(), getMe(), getUbuntu()]);
    expect(results).toEqual(
      Array.from({ length: 4 }, () => ({
        status: 200,
        json: { name: "example" },
      })),
    );
    expect(
      fetchMock.mock.calls.map(([request]) => request.headers.get("cookie")),
    ).toEqual(["lp-session=user-one", "lp-session=user-two", null, null]);
    expect(fetchMock.mock.calls[3][0].url).toBe(
      "https://lp.example/api/devel/ubuntu",
    );
  });
  it.each([
    {
      response: Response.json({ detail: "Denied" }, { status: 401 }),
      expected: { status: 401, json: { detail: "Denied" } },
    },
    {
      response: new Response("Unavailable", { status: 503 }),
      expected: { status: 503, text: "Unavailable" },
    },
  ])("displays upstream status and body", async ({ response, expected }) => {
    fetchMock.mockResolvedValueOnce(response);
    await expect(getUbuntu()).resolves.toEqual(expected);
  });
  it("turns network failures into a diagnostic 502", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new TypeError("Network unavailable"));
    await expect(getUbuntu()).rejects.toMatchObject({
      status: 502,
      body: { message: "Request to Launchpad failed" },
    });
  });
});
