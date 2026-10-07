import * as v from "valibot";
import { describe, expect, it } from "vitest";
import {
  MAX_PEOPLE_SEARCH_LENGTH,
  MIN_PEOPLE_SEARCH_LENGTH,
} from "../constants.js";
import { TableViewEditFormSchema } from "./schema.js";

describe("TableViewEditFormSchema", () => {
  it("requires a name to confirm", () => {
    const result = v.safeParse(TableViewEditFormSchema, {
      id: "mine",
      name: "  ",
    });

    expect(
      result.issues?.map((issue) => [v.getDotPath(issue), issue.message]),
    ).toEqual([["name", "Enter a view name"]]);
  });

  const searches = [
    ["search-maintainer", "maintainerSearch"],
    ["search-signer", "signerSearch"],
  ] as const;

  it.each(searches)("doesn't require a name to %s", (intent, field) => {
    expect(
      v.safeParse(TableViewEditFormSchema, {
        id: "mine",
        intent,
        name: "",
        [field]: " alice ",
      }).output,
    ).toMatchObject({ intent, [field]: "alice" });
  });

  it.each(
    searches.flatMap(([intent, field]) =>
      [
        "",
        `  ${"a".repeat(MIN_PEOPLE_SEARCH_LENGTH - 1)}  `,
        "a".repeat(MAX_PEOPLE_SEARCH_LENGTH + 1),
      ].map((search) => [intent, field, search] as const),
    ),
  )("rejects an invalid %s %s (%j)", (intent, field, search) => {
    const result = v.safeParse(TableViewEditFormSchema, {
      id: "mine",
      intent,
      [field]: search,
    });

    expect(result.issues?.map((issue) => v.getDotPath(issue))).toEqual([field]);
  });

  it("ignores the person searches when confirming", () => {
    expect(
      v.safeParse(TableViewEditFormSchema, {
        id: "mine",
        name: "Mine",
        maintainerSearch: "",
      }).success,
    ).toBe(true);
  });

  it("rejects an unknown intent", () => {
    expect(
      v.safeParse(TableViewEditFormSchema, {
        id: "mine",
        intent: "delete",
        name: "Mine",
      }).success,
    ).toBe(false);
  });
});
