import { describe, expect, it } from "vitest";
import { filtersDiffer } from "#lib/modules/filtering/utils.js";
import { DEFAULT_PACKAGES_FILTERS } from "./constants.js";
import type { PackagesFilters } from "./schema.js";

describe("filtersDiffer", () => {
  it("is false for equal filters", () => {
    expect(
      filtersDiffer(DEFAULT_PACKAGES_FILTERS, {
        ...DEFAULT_PACKAGES_FILTERS,
      }),
    ).toBe(false);
  });

  it.each([
    { series: "noble" },
    { search: "foo" },
    { match: "exact" },
    { allStatuses: true },
  ] as Partial<PackagesFilters>[])("is true when %j changes", (change) => {
    expect(
      filtersDiffer(DEFAULT_PACKAGES_FILTERS, {
        ...DEFAULT_PACKAGES_FILTERS,
        ...change,
      }),
    ).toBe(true);
  });

  it("throws for non-primitive values", () => {
    const withObject = {
      ...DEFAULT_PACKAGES_FILTERS,
      series: ["noble"],
    } as unknown as PackagesFilters;

    expect(() => filtersDiffer(DEFAULT_PACKAGES_FILTERS, withObject)).toThrow(
      /series/,
    );
  });
});
