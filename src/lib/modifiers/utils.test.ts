import { describe, expect, it } from "vitest";
import { combineModifiers, modifiers, modifiersValues } from "./utils";

describe("modifiers", () => {
  it("should pick specified categories from a ModifiersMap", () => {
    const allMods = {
      color: ["red", "blue"],
      size: ["small", "large"],
      shape: ["round", "square"],
    } as const;

    const picked = modifiers(allMods, "color", "shape");

    expect(picked).toEqual({
      color: ["red", "blue"],
      shape: ["round", "square"],
    });
    expect(picked).not.toHaveProperty("size");
  });

  it("should return an empty object if no categories are specified", () => {
    const allMods = {
      color: ["red", "blue"],
      size: ["small", "large"],
    } as const;

    const picked = modifiers(allMods);

    expect(picked).toEqual({});
  });

  it("should handle non-existent categories gracefully", () => {
    const allMods = {
      color: ["red", "blue"],
    } as const;

    // @ts-expect-error - testing invalid input
    const picked = modifiers(allMods, "color", "nonExistent");

    expect(picked).toEqual({
      color: ["red", "blue"],
      nonExistent: undefined,
    });
  });
});

describe("combineModifiers", () => {
  it("should merge two disjoint ModifiersMap objects", () => {
    const mods1 = { color: ["red", "blue"] } as const;
    const mods2 = { size: ["small", "large"] } as const;

    const combined = combineModifiers(mods1, mods2);

    expect(combined).toEqual({
      color: ["red", "blue"],
      size: ["small", "large"],
    });
  });

  it("should merge two ModifiersMap objects with overlapping keys, removing duplicates", () => {
    const mods1 = { color: ["red", "blue"], shape: ["round"] } as const;
    const mods2 = { color: ["green", "blue"], size: ["small"] } as const;

    const combined = combineModifiers(mods1, mods2);

    expect(combined).toEqual({
      color: ["red", "blue", "green"],
      shape: ["round"],
      size: ["small"],
    });
  });

  it("should handle one empty ModifiersMap", () => {
    const mods1 = { color: ["red", "blue"] } as const;
    const mods2 = {};

    const combined = combineModifiers(mods1, mods2);

    expect(combined).toEqual({
      color: ["red", "blue"],
    });
  });

  it("should handle two empty ModifiersMap objects", () => {
    const mods1 = {};
    const mods2 = {};

    const combined = combineModifiers(mods1, mods2);

    expect(combined).toEqual({});
  });
});

describe("modifiersValues", () => {
  it("should extract values from a ModifiersInput object", () => {
    const input = {
      color: "red",
      size: "large",
    };

    const values = modifiersValues(input);

    expect(values).toEqual(["red", "large"]);
  });

  it("should filter out null and undefined values", () => {
    const input = {
      color: "red",
      size: undefined,
      shape: null,
      border: "thin",
    };

    const values = modifiersValues(input);

    expect(values).toEqual(["red", "thin"]);
    expect(values).not.toContain(undefined);
    expect(values).not.toContain(null);
  });

  it("should return an empty array for an empty input object", () => {
    const input = {};
    const values = modifiersValues(input);
    expect(values).toEqual([]);
  });

  it("should return an empty array if input is undefined", () => {
    const values = modifiersValues(undefined);
    expect(values).toEqual([]);
  });

  it("should filter out other falsy values like empty string", () => {
    const input = {
      color: "red",
      size: "",
      shape: "round",
    };

    const values = modifiersValues(input);

    expect(values).toEqual(["red", "round"]);
  });
});
