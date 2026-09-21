import { describe, expect, it } from "vitest";
import { toPeoplePage } from "./peopleSearch.js";
import type { PersonOption } from "./peopleSearch.js";

const userl: PersonOption = {
  name: "userl",
  displayName: "User Launchpadio",
  isTeam: false,
};
const otherUser: PersonOption = {
  name: "userl-other",
  displayName: "Other User Launchpadio",
  isTeam: false,
};
const userlTeam: PersonOption = {
  name: "userl-team",
  displayName: "User Launchpadio team",
  isTeam: true,
};

describe("toPeoplePage", () => {
  it("puts the person named exactly as searched first", () => {
    expect(
      toPeoplePage({
        found: [otherUser, userl, userlTeam],
        exactMatch: userl,
        searchedName: "userl",
        hasMore: true,
      }),
    ).toEqual({ people: [userl, otherUser, userlTeam], hasMore: true });
  });

  it("leaves the exact match out of later pages that list it again", () => {
    expect(
      toPeoplePage({
        found: [userlTeam, userl],
        exactMatch: null,
        searchedName: "userl",
        hasMore: false,
      }),
    ).toEqual({ people: [userlTeam], hasMore: false });
  });

  it("keeps every result when the search is not a Launchpad name", () => {
    expect(
      toPeoplePage({
        found: [otherUser, userl],
        exactMatch: null,
        searchedName: null,
        hasMore: false,
      }),
    ).toEqual({ people: [otherUser, userl], hasMore: false });
  });
});
