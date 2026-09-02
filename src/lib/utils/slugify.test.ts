import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("normalizes casing, whitespace, and punctuation", () => {
    expect(slugify("  Hello, World!  ")).toBe("hello-world");
  });

  it("converts accented characters to ASCII", () => {
    expect(slugify("Crème brûlée")).toBe("creme-brulee");
  });

  it("returns only URL-safe slug characters", () => {
    const slug = slugify("A/B & C? #42");

    expect(slug).toBe("a-b-c-42");
    expect(slug).toMatch(/^[a-z0-9-]*$/);
  });
});
