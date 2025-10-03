import { describe, expect, it, vi } from "vitest";
import { format } from "./format.js";
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

describe("shortcut utils > format", () => {
  it("returns modifiers and key; maps ctrl->ctrl on non-mac", async () => {
    expect(format("ctrl+alt+z")).toEqual(["ctrl", "alt", "z"]);
  });

  it("maps ctrl->cmd on mac", async () => {
    isMac = true;
    expect(format("ctrl+k")).toEqual(["cmd", "k"]);
  });

  it("throws when key is missing", async () => {
    expect(() => format("ctrl+" as unknown as Shortcut)).toThrowError(
      /Invalid shortcut, missing key/i,
    );
  });
});
