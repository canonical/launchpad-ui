import { describe, expect, it } from "vitest";
import { launchpadNameCodec } from "./launchpadNameCodec.js";

const codec = launchpadNameCodec();

describe("launchpadNameCodec", () => {
  it.each([
    "stonking",
    "userl",
    "ubuntu-mozillateam",
    "a11y+team",
    "x.y",
    "xx",
    "all",
  ])("parses %j as itself", (raw) => {
    expect(codec.parse(raw)).toBe(raw);
  });

  it.each([
    [" Stonking ", "stonking"],
    [" UserL ", "userl"],
    ["~ubuntu-mozillateam", "ubuntu-mozillateam"],
    ["https://launchpad.net/~userl", "userl"],
    ["https://qastaging.launchpad.net/~userl", "userl"],
    ["https://api.qastaging.launchpad.net/devel/~userl", "userl"],
    ["http://launchpad.test/api/devel/~userl", "userl"],
    ["http://localhost:8085/~userl", "userl"],
    ["https://example.com/~xx", "xx"],
  ])("parses %j as the Launchpad name %j", (raw, expected) => {
    expect(codec.parse(raw)).toBe(expected);
  });

  it.each([
    null,
    "",
    "x",
    "~x",
    "https://example.com/~x",
    "Bad Value",
    "-leading-dash",
    "https://example.com/x",
    "https://launchpad.net/~userl/+archive",
    "https://launchpad.net/~userl?",
    "https://launchpad.net/api/../~userl",
  ])("parses %j as no filter", (raw) => {
    expect(codec.parse(raw)).toBeNull();
  });

  it("serializes a name as itself and no filter as an absent key", () => {
    expect(codec.serialize("stonking")).toBe("stonking");
    expect(codec.serialize("userl")).toBe("userl");
    expect(codec.serialize(null)).toBeNull();
  });
});
