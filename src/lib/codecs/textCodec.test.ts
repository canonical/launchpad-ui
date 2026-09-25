import { superhref } from "@canonical/superhref";
import { describe, expect, it } from "vitest";
import { textCodec } from "./textCodec.js";

const codec = textCodec();

describe("textCodec", () => {
  it.each([
    ["superhref", "superhref"],
    ["  superhref  ", "superhref"],
    ["super href", "super href"],
  ])("parses %j as the trimmed text %j", (raw, expected) => {
    expect(codec.parse(raw)).toBe(expected);
  });

  it.each([null, "", "   "])("parses %j as no text", (raw) => {
    expect(codec.parse(raw)).toBeNull();
  });

  it("serializes trimmed text and leaves blank text out", () => {
    expect(codec.serialize(" superhref ")).toBe("superhref");
    expect(codec.serialize("   ")).toBeNull();
    expect(codec.serialize(null)).toBeNull();
  });

  it("adds and removes the key in a schema", () => {
    const Params = superhref({ search: textCodec() });
    const url = new URL("https://x.test/?search=superhref");

    expect(Params.parse(url).search).toBe("superhref");
    expect(Params.patch(url, { search: " " }).search).toBe("");
    expect(
      Params.patch(new URL("https://x.test/"), { search: "super " }).search,
    ).toBe("?search=super");
  });
});
