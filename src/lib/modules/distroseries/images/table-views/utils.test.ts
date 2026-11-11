import { describe, expect, it } from "vitest";
import { DEFAULT_IMAGES_FILTERS } from "../filters/constants.js";
import { getRecommendedViewName } from "./utils.js";

describe("getRecommendedViewName", () => {
  it("is empty when no filters are set", () => {
    expect(getRecommendedViewName(DEFAULT_IMAGES_FILTERS)).toBe("");
  });

  it("describes the selected image filters", () => {
    expect(
      getRecommendedViewName({
        product: "ubuntu-core",
        buildStatus: "failed",
        testStatus: "passed",
      }),
    ).toBe("Ubuntu Core + Failed + Passed");
  });
});
