import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";
import { DEFAULT_IMAGES_FILTERS } from "./constants";
import { ImagesFiltersSchema, ParsedImagesFiltersSchema } from "./schema";
import type { ImagesFilters } from "./schema";

describe("ParsedImagesFiltersSchema", () => {
  it("accepts what ImagesFiltersSchema parses to", () => {
    expectTypeOf<
      v.InferInput<typeof ParsedImagesFiltersSchema>
    >().toEqualTypeOf<ImagesFilters>();
    expect(v.parse(ParsedImagesFiltersSchema, DEFAULT_IMAGES_FILTERS)).toEqual(
      DEFAULT_IMAGES_FILTERS,
    );
  });

  it("rejects form-shaped empty values", () => {
    expect(
      v.safeParse(ParsedImagesFiltersSchema, {
        ...DEFAULT_IMAGES_FILTERS,
        product: "",
      }).success,
    ).toBe(false);
  });
});

describe("ImagesFiltersSchema", () => {
  it("treats absent fields as the defaults", () => {
    expect(v.parse(ImagesFiltersSchema, {})).toEqual(DEFAULT_IMAGES_FILTERS);
  });

  it("parses empty fields to null", () => {
    expect(
      v.parse(ImagesFiltersSchema, {
        product: "",
        buildStatus: "",
        testStatus: "",
      }),
    ).toEqual(DEFAULT_IMAGES_FILTERS);
  });

  it("parses the submitted filters", () => {
    expect(
      v.parse(ImagesFiltersSchema, {
        product: "kubuntu",
        buildStatus: "successful",
        testStatus: "failed",
      }),
    ).toEqual({
      product: "kubuntu",
      buildStatus: "successful",
      testStatus: "failed",
    } satisfies ImagesFilters);
  });

  it.each([
    ["product", "fuzzy"],
    ["buildStatus", "Not a build status"],
    ["testStatus", "Not a test status"],
  ])("rejects an invalid %s: %j", (field, value) => {
    const result = v.safeParse(ImagesFiltersSchema, { [field]: value });

    expect(result.success).toBe(false);
    expect(result.issues?.map((issue) => v.getDotPath(issue))).toEqual([field]);
  });
});
