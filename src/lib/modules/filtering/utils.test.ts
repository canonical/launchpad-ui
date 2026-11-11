import { describe, expect, it } from "vitest";
import type { ImagesFilters } from "../distroseries/images/filters/schema.js";
import { filtersDiffer } from "./utils.js";

describe("filtersDiffer", () => {
  it("compares image filters", () => {
    const filters: ImagesFilters = {
      product: null,
      buildStatus: null,
      testStatus: null,
    };

    expect(
      filtersDiffer(filters, { ...filters, buildStatus: "successful" }),
    ).toBe(true);
  });
});
