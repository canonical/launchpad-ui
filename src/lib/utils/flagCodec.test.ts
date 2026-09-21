import { superhref } from "@canonical/superhref";
import { describe, expect, it } from "vitest";
import { flagCodec } from "./flagCodec";

const codec = flagCodec();

describe("flagCodec", () => {
  it.each(["1", "true", "yes", "on", ""])("parses %j as set", (raw) => {
    expect(codec.parse(raw)).toBe(true);
  });

  it.each([null, "0", "false", "no", "off", "abc"])(
    "parses %j as unset",
    (raw) => {
      expect(codec.parse(raw)).toBe(false);
    },
  );

  it("serializes a set flag as a short value and an unset flag as an absent key", () => {
    expect(codec.serialize(true)).toBe("1");
    expect(codec.serialize(false)).toBeNull();
    expect(codec.serialize(null)).toBeNull();
  });

  it("defaults to unset", () => {
    expect(codec.default).toBe(false);
  });

  it("adds and removes the key in a schema", () => {
    const Params = superhref({ flag: flagCodec() });
    const url = new URL("https://x.test/");

    expect(Params.patch(url, { flag: true }).search).toBe("?flag=1");
    expect(
      Params.patch(new URL("https://x.test/?flag=1"), { flag: false }).search,
    ).toBe("");
  });
});
