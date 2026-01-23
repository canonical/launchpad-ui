import { describe, expect, it } from "vitest";
import { booleanSearchParam } from "./booleanSearchParam";

describe("booleanSearchParam", () => {
  it("returns false for null", () => {
    expect(booleanSearchParam(null)).toBe(false);
  });

  describe("string values", () => {
    it.each([
      "",
      "   ",
      "\n\t  ",
      "true",
      "TRUE",
      "TrUe",
      " true ",
      "1",
      "yes",
      "YES",
      " yes ",
      "on",
      "ON",
      "on ",
    ])("maps %j -> true", (value) => {
      expect(booleanSearchParam(value)).toBe(true);
    });

    it.each([
      "false",
      "FALSE",
      "0",
      "no",
      "off",
      "random",
      "01",
      " false ",
      " 0 ",
      "yes no",
      "on off",
    ])("maps %j -> false", (value) => {
      expect(booleanSearchParam(value)).toBe(false);
    });
  });
});
