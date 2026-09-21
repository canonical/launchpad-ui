import { describe, expect, it } from "vitest";
import { personCodec } from "./personCodec.js";

const codec = personCodec();

describe("personCodec", () => {
  it.each(["me", "userl", "ubuntu-mozillateam", "a11y+team", "x.y", "all"])(
    "parses %j as itself",
    (raw) => {
      expect(codec.parse(raw)).toBe(raw);
    },
  );

  it.each([
    ["https://launchpad.net/~userl", "userl"],
    ["https://qastaging.launchpad.net/~userl", "userl"],
    ["https://api.qastaging.launchpad.net/devel/~userl", "userl"],
    ["http://launchpad.test/api/devel/~userl", "userl"],
    ["http://localhost:8085/~userl", "userl"],
    ["https://example.com/~x", "x"],
    ["~ubuntu-mozillateam", "ubuntu-mozillateam"],
    [" UserL ", "userl"],
  ])("parses %j as the Launchpad name %j", (raw, expected) => {
    expect(codec.parse(raw)).toBe(expected);
  });

  it.each([null, "", "Bad Value", "-leading-dash", "https://example.com/x"])(
    "parses %j as no filter",
    (raw) => {
      expect(codec.parse(raw)).toBeNull();
    },
  );

  it("serializes a name as itself and no filter as an absent key", () => {
    expect(codec.serialize("userl")).toBe("userl");
    expect(codec.serialize("me")).toBe("me");
    expect(codec.serialize(null)).toBeNull();
  });
});
