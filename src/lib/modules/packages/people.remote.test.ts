import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_PEOPLE_SEARCH_LENGTH,
  MIN_PEOPLE_SEARCH_LENGTH,
} from "./constants.js";
import { findPeople, getPersonByName } from "./people.remote.js";

vi.mock("$app/server", () => ({
  query: (schema: v.GenericSchema, handler: (args: unknown) => unknown) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));
vi.mock("$env/dynamic/private", () => ({
  env: { MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example" },
}));

const userl = {
  self_link: "https://lp.example/api/devel/~userl",
  resource_type_link: "https://lp.example/api/devel/#person",
  name: "userl",
  display_name: "User Launchpadio",
  is_team: false,
  mugshot_link: "https://lp.example/media/userl.jpg",
};
const team = {
  ...userl,
  self_link: "https://lp.example/api/devel/~userl-team",
  name: "userl-team",
  display_name: "User Launchpadio team",
  is_team: true,
};
const fetchMock = vi.hoisted(() => {
  const fetchMock = vi.fn<(request: Request) => Promise<Response>>();
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
});

function respondWith(
  entries = [team, userl],
  exactMatch: typeof userl | null = userl,
) {
  fetchMock.mockImplementation(async (request: Request) => {
    const isSearch = new URL(request.url).pathname.endsWith("/people");
    return isSearch
      ? Response.json({
          start: 0,
          entries,
          next_collection_link:
            "https://lp.example/api/devel/people?ws.start=2",
        })
      : Response.json(exactMatch, { status: exactMatch === null ? 404 : 200 });
  });
}
function urls(): URL[] {
  return fetchMock.mock.calls.map(
    ([request]: [Request]) => new URL(request.url),
  );
}
beforeEach(() => {
  fetchMock.mockReset();
  respondWith();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("findPeople", () => {
  it.each([
    {
      description: "puts the exact match first without duplicates",
      entries: [team, userl],
      exactMatch: userl,
      expected: [userl, team],
    },
    {
      description: "includes an exact match missing from search",
      entries: [team],
      exactMatch: userl,
      expected: [userl, team],
    },
    {
      description: "keeps results without an exact match",
      entries: [team, userl],
      exactMatch: null,
      expected: [team, userl],
    },
    {
      description: "returns empty results when nobody matches",
      entries: [],
      exactMatch: null,
      expected: [],
    },
  ])("$description", async ({ entries, exactMatch, expected }) => {
    respondWith(entries, exactMatch);
    await expect(findPeople({ text: "userl" })).resolves.toEqual(expected);
  });

  it.each([" UserL ", "~userl", "https://launchpad.net/~userl"])(
    "normalizes %s and searches once without pagination",
    async (text) => {
      await expect(findPeople({ text })).resolves.toEqual([userl, team]);
      expect(urls().map((url) => url.pathname)).toEqual([
        "/api/devel/~userl",
        "/api/devel/people",
      ]);
      expect(Object.fromEntries(urls()[1].searchParams)).toEqual({
        text: "userl",
        "ws.op": "find",
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    },
  );

  it("searches display names without an exact lookup", async () => {
    await expect(findPeople({ text: " User Launchpadio " })).resolves.toEqual([
      team,
      userl,
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(urls()[0].searchParams.get("text")).toBe("User Launchpadio");
  });

  it.each([MIN_PEOPLE_SEARCH_LENGTH, MAX_PEOPLE_SEARCH_LENGTH])(
    "accepts %i-character search text",
    async (length) => {
      const text = "a".repeat(length);
      await findPeople({ text });
      expect(
        urls()
          .find((url) => url.pathname.endsWith("/people"))
          ?.searchParams.get("text"),
      ).toBe(text);
    },
  );

  const tooShort = "a".repeat(MIN_PEOPLE_SEARCH_LENGTH - 1);
  it.each([
    "",
    " ",
    tooShort,
    ` ${tooShort} `,
    "a".repeat(MAX_PEOPLE_SEARCH_LENGTH + 1),
  ])("rejects invalid search length (%s)", async (text) => {
    await expect(findPeople({ text })).rejects.toBeInstanceOf(v.ValiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("logs an exact lookup failure and keeps search results", async () => {
    const failure = new Error("Lookup failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(failure);
    await expect(findPeople({ text: "userl" })).resolves.toEqual([team, userl]);
    expect(log).toHaveBeenCalledWith(
      "Failed to look up the Launchpad person userl",
      failure,
    );
  });

  it("propagates a search failure", async () => {
    const failure = new Error("Search failed");
    fetchMock
      .mockResolvedValueOnce(Response.json(userl))
      .mockRejectedValueOnce(failure);
    await expect(findPeople({ text: "userl" })).rejects.toBe(failure);
  });
});

describe("getPersonByName", () => {
  it.each(["userl", " UserL ", "~userl", "https://launchpad.net/~userl"])(
    "normalizes %s and looks the person up",
    async (reference) => {
      await expect(getPersonByName(reference)).resolves.toEqual(userl);
      expect(urls()[0].pathname).toBe("/api/devel/~userl");
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect((fetchMock.mock.calls[0][0] as Request).redirect).toBe("follow");
    },
  );
  it("looks up short valid names", async () => {
    await getPersonByName("ab");
    expect(urls()[0].pathname).toBe("/api/devel/~ab");
  });
  it("returns null for an invalid Launchpad reference", async () => {
    await expect(getPersonByName("User Launchpadio")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([404, 410])("returns null on HTTP %i", async (status) => {
    fetchMock.mockResolvedValueOnce(Response.json(null, { status }));
    await expect(getPersonByName("nobody")).resolves.toBeNull();
  });
  it("preserves nullable mugshots rather than fabricating an image URL", async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ ...userl, mugshot_link: null }),
    );
    await expect(getPersonByName("userl")).resolves.toMatchObject({
      mugshot_link: null,
    });
  });
  it("propagates other HTTP failures", async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ detail: "Unavailable" }, { status: 503 }),
    );
    await expect(getPersonByName("userl")).rejects.toMatchObject({
      name: "LaunchpadApiError",
      status: 503,
      body: { detail: "Unavailable" },
    });
  });
});
