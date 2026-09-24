import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  findPeople as findLaunchpadPeople,
  getPerson,
} from "$lib/server/launchpad/client.js";
import type { PersonEntry } from "$lib/server/launchpad/types.js";
import { findPeople } from "./people.remote.js";

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
};
const team: PersonEntry = {
  ...userl,
  self_link: "https://lp.example/api/devel/~userl-team",
  name: "userl-team",
  display_name: "User Launchpadio team",
  is_team: true,
};
const userlOption = {
  name: "userl",
  displayName: "User Launchpadio",
  isTeam: false,
};
const teamOption = {
  name: "userl-team",
  displayName: "User Launchpadio team",
  isTeam: true,
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
      expected: [userlOption, teamOption],
    },
    {
      description: "includes an exact match missing from the search results",
      entries: [team],
      exactMatch: userl,
      expected: [userlOption, teamOption],
    },
    {
      description: "keeps every result when there is no exact match",
      entries: [team, userl],
      exactMatch: null,
      expected: [teamOption, userlOption],
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
      await expect(findPeople({ text })).resolves.toEqual([
        userlOption,
        teamOption,
      ]);
      expect(findLaunchpadPeople).toHaveBeenCalledExactlyOnceWith("userl");
      expect(getPerson).toHaveBeenCalledExactlyOnceWith("userl");
    },
  );

  it("searches display names without an exact-name lookup", async () => {
    await expect(findPeople({ text: " User Launchpadio " })).resolves.toEqual([
      teamOption,
      userlOption,
    ]);
    expect(findLaunchpadPeople).toHaveBeenCalledExactlyOnceWith(
      "User Launchpadio",
    );
    expect(getPerson).not.toHaveBeenCalled();
  });

  it.each([2, 200])("accepts %i-character search text", async (length) => {
    const text = "a".repeat(length);
    await findPeople({ text });

    expect(findLaunchpadPeople).toHaveBeenCalledExactlyOnceWith(text);
  });

  it.each(["", " ", "a", " a ", "a".repeat(201)])(
    "rejects search text outside the length limits (%s)",
    async (text) => {
      await expect(findPeople({ text })).rejects.toBeInstanceOf(v.ValiError);
      expect(findLaunchpadPeople).not.toHaveBeenCalled();
      expect(getPerson).not.toHaveBeenCalled();
    },
  );

  it("logs an exact-name lookup failure and keeps the search results", async () => {
    const failure = new Error("Lookup failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getPerson).mockRejectedValue(failure);

    await expect(findPeople({ text: "userl" })).resolves.toEqual([
      teamOption,
      userlOption,
    ]);
    expect(log).toHaveBeenCalledWith(
      "Failed to look up the Launchpad person userl",
      failure,
    );
  });

  it("logs a search failure and returns an empty list", async () => {
    const failure = new Error("Search failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(findLaunchpadPeople).mockRejectedValue(failure);

    await expect(findPeople({ text: "userl" })).resolves.toEqual([]);
    expect(log).toHaveBeenCalledWith(
      "Failed to search Launchpad people",
      failure,
    );
  });
});
