import { describe, expect, it } from "vitest";
import { DEFAULT_PACKAGES_FILTERS } from "../filters/constants.js";
import { MAX_TABLE_VIEW_NAME_LENGTH } from "./constants.js";
import { getRecommendedViewName } from "./utils.js";

describe("getRecommendedViewName", () => {
  it("is empty when no filters are set", () => {
    expect(getRecommendedViewName(DEFAULT_PACKAGES_FILTERS)).toBe("");
  });

  it("joins the set filters", () => {
    expect(
      getRecommendedViewName({
        ...DEFAULT_PACKAGES_FILTERS,
        search: "lib",
        series: "resolute",
        ubuntuChange: true,
      }),
    ).toBe('"lib" + Resolute + Changed by Ubuntu');
  });

  it("describes every filter", () => {
    expect(
      getRecommendedViewName({
        search: "lib",
        match: "exact",
        series: "noble",
        pocket: "Updates",
        maintainer: "foo",
        signer: "bar",
        ubuntuChange: true,
        allStatuses: true,
      }),
    ).toBe(
      '"lib" + Noble + Updates + Maintained by foo + Signed by bar + Changed by Ubuntu + All statuses',
    );
  });

  it("truncates names exceeding the maximum length", () => {
    const name = getRecommendedViewName({
      ...DEFAULT_PACKAGES_FILTERS,
      search: "a".repeat(MAX_TABLE_VIEW_NAME_LENGTH),
    });

    expect(name).toHaveLength(MAX_TABLE_VIEW_NAME_LENGTH);
    expect(name.endsWith("…")).toBe(true);
  });
});
