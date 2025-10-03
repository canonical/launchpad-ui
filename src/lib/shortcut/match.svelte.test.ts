import { describe, expect, it, vi } from "vitest";
import { match } from "./match.js";

let { isMac } = vi.hoisted(() => {
  const isMac = false;
  return { isMac };
});

vi.mock("./platform.js", () => {
  return {
    isMac: () => isMac,
  };
});

describe("shortcut utils > match", () => {
  it("matches exact by default and rejects extra modifiers", async () => {
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
      shiftKey: true,
    });

    expect(match(ev, "ctrl+a")).toBe(false);
  });

  it("allows extra modifiers when exact=false", async () => {
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    });

    expect(match(ev, "ctrl+a", { exact: false })).toBe(true);
  });

  it("normalizes event key (Esc→escape) for matching", async () => {
    const ev = new KeyboardEvent("keydown", {
      code: "Escape",
      ctrlKey: true,
    });

    expect(match(ev, "ctrl+escape")).toBe(true);
  });

  it("treats ctrl as cmd on mac", async () => {
    isMac = true;
    const ev = new KeyboardEvent("keydown", {
      code: "KeyK",
      metaKey: true,
    });

    expect(match(ev, "ctrl+k")).toBe(true);
  });

  it("doesn't treat ctrl as cmd when a mac specific shortcut is used", async () => {
    isMac = true;
    const ev = new KeyboardEvent("keydown", {
      code: "KeyK",
      ctrlKey: true,
    });

    expect(match(ev, "ctrl+k|cmd+l")).toBe(false);
  });
});
