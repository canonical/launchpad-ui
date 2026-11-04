import { describe, expect, it } from "vitest";
import { getNestedValue, setNestedValue } from "./object";

describe("getNestedValue", () => {
  it("returns a flat property", () => {
    const obj = { a: 1 };
    expect(getNestedValue(obj, "a")).toBe(1);
  });

  it("returns a nested property with dot notation", () => {
    const obj = { a: { b: { c: 42 } } };
    expect(getNestedValue(obj, "a.b.c")).toBe(42);
  });

  it("returns undefined for missing nested property", () => {
    const obj = { a: { b: 1 } };
    expect(getNestedValue(obj, "a.b.c")).toBeUndefined();
  });

  it("returns undefined for missing property at any level", () => {
    const obj = { a: { b: 1 } };
    expect(getNestedValue(obj, "x.y.z")).toBeUndefined();
  });
});

describe("setNestedValue", () => {
  it("sets a flat property", () => {
    const obj = {};
    const result = setNestedValue(obj, "a", 1);
    expect(result).toEqual({ a: 1 });
  });

  it("sets a nested property with dot notation", () => {
    const obj = {};
    const result = setNestedValue(obj, "a.b.c", 42);
    expect(result).toEqual({ a: { b: { c: 42 } } });
  });

  it("preserves existing properties", () => {
    const obj = { a: { x: 1 } };
    const result = setNestedValue(obj, "a.b", 2);
    expect(result).toEqual({ a: { x: 1, b: 2 } });
  });

  it("does not mutate the original object", () => {
    const obj = { a: { x: 1 } };
    setNestedValue(obj, "a.b", 2);
    expect(obj).toEqual({ a: { x: 1 } });
  });
});
