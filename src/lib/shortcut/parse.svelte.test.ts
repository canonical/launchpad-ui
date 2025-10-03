import { describe, expect, it } from "vitest";
import type { Shortcut } from "./type.js";

describe("shortcut utils > parse", () => {
  it("parses modifiers and key", async () => {
    const { parse } = await import("./parse.js");
    expect(parse("ctrl+shift+a")).toEqual({
      wants: { ctrl: true, alt: false, shift: true },
      key: "a",
    });
  });

  it("throws when key is missing", async () => {
    const { parse } = await import("./parse.js");
    expect(() => parse("ctrl+shift+" as unknown as Shortcut)).toThrowError(
      /Invalid shortcut, missing key/i,
    );
  });
});
