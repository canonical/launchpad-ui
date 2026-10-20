import { superhref } from "@canonical/superhref";
import { describe, expect, it } from "vitest";
import { choiceCodec } from "./choiceCodec.js";

const codec = choiceCodec(["list", "grid", "table"], "list");

describe("choiceCodec", () => {
  it.each(["list", "grid", "table"])("parses %j as itself", (raw) => {
    expect(codec.parse(raw)).toBe(raw);
  });

  it.each([null, "", "Grid", "tiles"])("parses %j as the default", (raw) => {
    expect(codec.parse(raw)).toBe("list");
  });

  it("serializes a choice as itself and the default as an absent key", () => {
    expect(codec.serialize("grid")).toBe("grid");
    expect(codec.serialize("list")).toBeNull();
    expect(codec.serialize(null)).toBeNull();
  });

  it("defaults to the given choice", () => {
    expect(codec.default).toBe("list");
  });

  it("adds and removes the key in a schema", () => {
    const Params = superhref({
      layout: choiceCodec(["list", "grid", "table"], "list"),
    });

    expect(
      Params.patch(new URL("https://x.test/"), { layout: "grid" }).search,
    ).toBe("?layout=grid");
    expect(
      Params.patch(new URL("https://x.test/?layout=grid"), { layout: "list" })
        .search,
    ).toBe("");
  });
});
