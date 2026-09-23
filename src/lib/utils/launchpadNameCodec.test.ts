import { describe, expect, it } from "vitest";
import { launchpadNameCodec } from "./launchpadNameCodec.js";

const codec = launchpadNameCodec();

describe("launchpadNameCodec", () => {
  it.each(["stonking", "ubuntu-mozillateam", "a11y+team", "x.y"])(
    "parses %j as itself",
    (raw) => {
      expect(codec.parse(raw)).toBe(raw);
    },
  );

  it.each([
    [" Stonking ", "stonking"],
    ["~ubuntu-mozillateam", "ubuntu-mozillateam"],
  ])("parses %j as the Launchpad name %j", (raw, expected) => {
    expect(codec.parse(raw)).toBe(expected);
  });

  it.each([null, "", "Bad Value", "-leading-dash"])(
    "parses %j as no filter",
    (raw) => {
      expect(codec.parse(raw)).toBeNull();
    },
  );

  it("serializes a name as itself and no filter as an absent key", () => {
    expect(codec.serialize("stonking")).toBe("stonking");
    expect(codec.serialize(null)).toBeNull();
  });
});
