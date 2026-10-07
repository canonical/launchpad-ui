import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";
import {
  DEFAULT_PACKAGES_FILTERS,
  MAX_PACKAGES_SEARCH_LENGTH,
} from "./constants.js";
import {
  PackagesFiltersSchema,
  ParsedPackagesFiltersSchema,
} from "./schema.js";
import type { PackagesFilters } from "./schema.js";

describe("ParsedPackagesFiltersSchema", () => {
  it("accepts what PackagesFiltersSchema parses to", () => {
    expectTypeOf<
      v.InferInput<typeof ParsedPackagesFiltersSchema>
    >().toEqualTypeOf<PackagesFilters>();
    expect(
      v.parse(ParsedPackagesFiltersSchema, DEFAULT_PACKAGES_FILTERS),
    ).toEqual(DEFAULT_PACKAGES_FILTERS);
  });

  it("rejects form-shaped empty values", () => {
    expect(
      v.safeParse(ParsedPackagesFiltersSchema, {
        ...DEFAULT_PACKAGES_FILTERS,
        pocket: "",
      }).success,
    ).toBe(false);
  });
});

describe("PackagesFiltersSchema", () => {
  it("treats absent fields as the defaults", () => {
    expect(v.parse(PackagesFiltersSchema, {})).toEqual(
      DEFAULT_PACKAGES_FILTERS,
    );
  });

  it("parses empty fields and a blank search to null", () => {
    expect(
      v.parse(PackagesFiltersSchema, {
        search: "  ",
        series: "",
        pocket: "",
        maintainer: "",
        signer: "",
      }),
    ).toEqual(DEFAULT_PACKAGES_FILTERS);
  });

  it("parses the submitted filters", () => {
    expect(
      v.parse(PackagesFiltersSchema, {
        search: " linux ",
        match: "exact",
        series: "noble",
        pocket: "Updates",
        maintainer: "alice",
        signer: "bob",
        ubuntuChange: true,
        allStatuses: true,
      }),
    ).toEqual({
      search: "linux",
      match: "exact",
      series: "noble",
      pocket: "Updates",
      maintainer: "alice",
      signer: "bob",
      ubuntuChange: true,
      allStatuses: true,
    } satisfies PackagesFilters);
  });

  it.each([
    ["match", "fuzzy"],
    ["pocket", "Nope"],
    ["series", "Not A Series"],
    ["series", "  "],
    ["maintainer", "~alice"],
    ["search", "a".repeat(MAX_PACKAGES_SEARCH_LENGTH + 1)],
  ])("rejects an invalid %s: %j", (field, value) => {
    const result = v.safeParse(PackagesFiltersSchema, { [field]: value });

    expect(result.success).toBe(false);
    expect(result.issues?.map((issue) => v.getDotPath(issue))).toEqual([field]);
  });
});
