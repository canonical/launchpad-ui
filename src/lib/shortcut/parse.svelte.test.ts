import { describe, expect, it, vi } from "vitest";
import { parse } from "./parse.js";
import type { Shortcut } from "./type.js";

let { isMac } = vi.hoisted(() => {
  const isMac = false;
  return { isMac };
});

vi.mock("./platform.js", () => {
  return {
    isMac: () => isMac,
  };
});

describe("shortcut utils > parse", () => {
  it("returns modifiers and key; maps ctrl->ctrl on non-mac", async () => {
    isMac = false;
    expect(parse("ctrl+alt+z")).toEqual(["ctrl", "alt", "z"]);
  });

  it("maps ctrl->cmd on mac", async () => {
    isMac = true;
    expect(parse("ctrl+k")).toEqual(["cmd", "k"]);
  });

  it("uses explicit mac override when provided (mac)", async () => {
    isMac = true;
    expect(parse(["ctrl+alt+z", "cmd+option+x"])).toEqual([
      "cmd",
      "option",
      "x",
    ]);
  });

  it("falls back to standard mapping when mac override is absent (mac)", async () => {
    isMac = true;
    expect(parse("ctrl+shift+k")).toEqual(["cmd", "shift", "k"]);
  });

  it("ignores mac override on non-mac", async () => {
    isMac = false;
    expect(parse(["ctrl+alt+z", "cmd+option+x"])).toEqual(["ctrl", "alt", "z"]);
  });

  it("throws when key is missing", async () => {
    expect(() => parse("ctrl+" as unknown as Shortcut)).toThrowError(
      /Invalid shortcut, missing key/i,
    );
  });

  it("throws when mac override is missing key on mac", async () => {
    isMac = true;
    expect(() => parse(["ctrl+k", "cmd+"] as unknown as Shortcut)).toThrowError(
      /Invalid shortcut, missing mac key/i,
    );
  });
});
