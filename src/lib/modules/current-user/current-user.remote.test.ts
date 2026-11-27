import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser, getCurrentUserTeams } from "./current-user.remote.js";

const session = vi.hoisted(() => ({ cookie: undefined as string | undefined }));

vi.mock("$app/server", () => ({
  query: (handler: () => unknown) =>
    Object.assign(async () => handler(), { __: { type: "query" } }),
  getRequestEvent: () => ({
    cookies: {
      get: (name: string) => (name === "lp" ? session.cookie : undefined),
    },
  }),
}));

vi.mock(
  "$app/env/private",
  () =>
    ({
      MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example",
      MAIN_LAUNCHPAD_COOKIE_NAME: "lp",
      MAIN_LAUNCHPAD_IP_ADDRESS: undefined,
      MAIN_LAUNCHPAD_SKIP_TLS_VERIFY: false,
      TEST_OBSERVER_IMAGE_ARTIFACTS_URL:
        "https://observer.example/v1/artefacts?family=image",
    }) satisfies typeof import("$app/env/private"),
);

const fetchMock = vi.hoisted(() => {
  const fetchMock = vi.fn<(request: Request) => Promise<Response>>();
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
});

const API = "https://lp.example/api/devel";
const ME = `${API}/people/+me`;
const FIRST_TEAMS_PAGE = `${API}/people/+me/super_teams?ws.size=300`;
const SECOND_TEAMS_PAGE = `${API}/~rosie/super_teams?ws.size=300&memo=300&ws.start=300`;

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  session.cookie = "session-token";
  respondWith({
    [ME]: {
      name: "rosie",
      display_name: "Rosie Example",
      web_link: "https://lp.example/~rosie",
      self_link: `${API}/~rosie`,
    },
    [FIRST_TEAMS_PAGE]: teamsPage(["ubuntu-dev"], SECOND_TEAMS_PAGE),
    [SECOND_TEAMS_PAGE]: teamsPage(["admins"]),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getCurrentUser tells who is logged in to Launchpad", () => {
  it("If the session cookie is absent, does not call Launchpad and returns undefined", async () => {
    session.cookie = undefined;

    await expect(getCurrentUser()).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("Uses the session cookie to make a '+me' request and return the person's name, display name and profile link", async () => {
    await expect(getCurrentUser()).resolves.toEqual({
      name: "rosie",
      display_name: "Rosie Example",
      web_link: "https://lp.example/~rosie",
    });
    expect(sentRequests()).toEqual([[ME, "lp=session-token"]]);
  });

  it("Treats a session Launchpad rejects as logged out without logging an error", async () => {
    const consoleError = vi.spyOn(console, "error");
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await expect(getCurrentUser()).resolves.toBeUndefined();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("Treats a Launchpad failure as logged out and logs an error", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    await expect(getCurrentUser()).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});

describe("getCurrentUserTeams lists the teams the logged-in user belongs to, directly or through other teams", () => {
  it("If the session cookie is absent, does not call Launchpad and returns no teams", async () => {
    session.cookie = undefined;

    await expect(getCurrentUserTeams()).resolves.toEqual(new Set());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("Uses the session cookie to request every page of '+me/super_teams' and return the team names", async () => {
    await expect(getCurrentUserTeams()).resolves.toEqual(
      new Set(["ubuntu-dev", "admins"]),
    );
    expect(sentRequests()).toEqual([
      [FIRST_TEAMS_PAGE, "lp=session-token"],
      [SECOND_TEAMS_PAGE, "lp=session-token"],
    ]);
  });

  it("Treats a session Launchpad rejects as logged out and returns no teams without logging an error", async () => {
    const consoleError = vi.spyOn(console, "error");
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await expect(getCurrentUserTeams()).resolves.toEqual(new Set());
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("Treats a Launchpad failure as logged out, returns no teams and logs an error", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    await expect(getCurrentUserTeams()).resolves.toEqual(new Set());
    expect(consoleError).toHaveBeenCalledOnce();
  });
});

function respondWith(bodies: Record<string, unknown>) {
  fetchMock.mockImplementation(
    async (request: Request) =>
      new Response(JSON.stringify(bodies[request.url]), {
        headers: { "content-type": "application/json" },
      }),
  );
}

function sentRequests() {
  return fetchMock.mock.calls.map(([request]) => [
    request.url,
    request.headers.get("cookie"),
  ]);
}

function teamsPage(names: string[], nextLink?: string) {
  return {
    start: 0,
    entries: names.map((name) => ({ name, self_link: `${API}/~${name}` })),
    ...(nextLink && { next_collection_link: nextLink }),
  };
}
