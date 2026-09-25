import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  findPeople as findLaunchpadPeople,
  getPerson,
} from "$lib/server/launchpad/client.js";
import type { PersonEntry } from "$lib/server/launchpad/types.js";
import {
  MAX_PEOPLE_SEARCH_LENGTH,
  MIN_PEOPLE_SEARCH_LENGTH,
} from "./constants.js";
import { findPeople, getPersonByName } from "./people.remote.js";

vi.mock("$app/server", () => ({
  query: (
    schema: v.GenericSchema,
    handler: (args: unknown) => Promise<unknown>,
  ) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));

vi.mock("$lib/server/launchpad/client.js", () => ({
  findPeople: vi.fn(),
  getPerson: vi.fn(),
}));

const userl: PersonEntry = {
  self_link: "https://lp.example/api/devel/~userl",
  resource_type_link: "https://lp.example/api/devel/#person",
  name: "userl",
  display_name: "User Launchpadio",
  is_team: false,
  mugshot_link: "https://lp.example/media/userl.jpg",
};
const team: PersonEntry = {
  ...userl,
  self_link: "https://lp.example/api/devel/~userl-team",
  name: "userl-team",
  display_name: "User Launchpadio team",
  is_team: true,
};

beforeEach(() => {
  vi.mocked(findLaunchpadPeople)
    .mockReset()
    .mockResolvedValue({
      start: 0,
      entries: [team, userl],
      next_collection_link: "https://lp.example/api/devel/people?ws.start=2",
    });
  vi.mocked(getPerson).mockReset().mockResolvedValue(userl);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("findPeople", () => {
  it.each([
    {
      description: "puts the exact match first without duplicating it",
      entries: [team, userl],
      exactMatch: userl,
      expected: [userl, team],
    },
    {
      description: "includes an exact match missing from the search results",
      entries: [team],
      exactMatch: userl,
      expected: [userl, team],
    },
    {
      description: "keeps every result when there is no exact match",
      entries: [team, userl],
      exactMatch: null,
      expected: [team, userl],
    },
    {
      description: "returns an empty list when nobody matches",
      entries: [],
      exactMatch: null,
      expected: [],
    },
  ])("$description", async ({ entries, exactMatch, expected }) => {
    vi.mocked(findLaunchpadPeople).mockResolvedValue({ start: 0, entries });
    vi.mocked(getPerson).mockResolvedValue(exactMatch);

    await expect(findPeople({ text: "userl" })).resolves.toEqual(expected);
  });

  it.each([" UserL ", "~userl", "https://launchpad.net/~userl"])(
    "normalizes %s and searches once without pagination",
    async (text) => {
      await expect(findPeople({ text })).resolves.toEqual([userl, team]);
      expect(findLaunchpadPeople).toHaveBeenCalledExactlyOnceWith("userl");
      expect(getPerson).toHaveBeenCalledExactlyOnceWith("userl");
    },
  );

  it("searches display names without an exact-name lookup", async () => {
    await expect(findPeople({ text: " User Launchpadio " })).resolves.toEqual([
      team,
      userl,
    ]);
    expect(findLaunchpadPeople).toHaveBeenCalledExactlyOnceWith(
      "User Launchpadio",
    );
    expect(getPerson).not.toHaveBeenCalled();
  });

  it.each([MIN_PEOPLE_SEARCH_LENGTH, MAX_PEOPLE_SEARCH_LENGTH])(
    "accepts %i-character search text",
    async (length) => {
      const text = "a".repeat(length);
      await findPeople({ text });

      expect(findLaunchpadPeople).toHaveBeenCalledExactlyOnceWith(text);
    },
  );

  const tooShort = "a".repeat(MIN_PEOPLE_SEARCH_LENGTH - 1);
  it.each([
    "",
    " ",
    tooShort,
    ` ${tooShort} `,
    "a".repeat(MAX_PEOPLE_SEARCH_LENGTH + 1),
  ])("rejects search text outside the length limits (%s)", async (text) => {
    await expect(findPeople({ text })).rejects.toBeInstanceOf(v.ValiError);
    expect(findLaunchpadPeople).not.toHaveBeenCalled();
    expect(getPerson).not.toHaveBeenCalled();
  });

  it("logs an exact-name lookup failure and keeps the search results", async () => {
    const failure = new Error("Lookup failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getPerson).mockRejectedValue(failure);

    await expect(findPeople({ text: "userl" })).resolves.toEqual([team, userl]);
    expect(log).toHaveBeenCalledWith(
      "Failed to look up the Launchpad person userl",
      failure,
    );
  });

  it("propagates a search failure", async () => {
    const failure = new Error("Search failed");
    vi.mocked(findLaunchpadPeople).mockRejectedValue(failure);

    await expect(findPeople({ text: "userl" })).rejects.toBe(failure);
  });
});

describe("getPersonByName", () => {
  it.each(["userl", " UserL ", "~userl", "https://launchpad.net/~userl"])(
    "normalizes %s and looks the person up",
    async (reference) => {
      await expect(getPersonByName(reference)).resolves.toEqual(userl);
      expect(getPerson).toHaveBeenCalledExactlyOnceWith("userl");
    },
  );

  it("looks up names shorter than the minimum search length", async () => {
    await getPersonByName("ab");

    expect(getPerson).toHaveBeenCalledExactlyOnceWith("ab");
  });

  it("returns null for a reference that is not a Launchpad name", async () => {
    await expect(getPersonByName("User Launchpadio")).resolves.toBeNull();
    expect(getPerson).not.toHaveBeenCalled();
  });

  it("returns null when the person does not exist", async () => {
    vi.mocked(getPerson).mockResolvedValue(null);

    await expect(getPersonByName("userl")).resolves.toBeNull();
  });
});
