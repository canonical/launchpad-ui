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
      key: "a",
      ctrlKey: true,
      shiftKey: true,
    });

    expect(match(ev, "ctrl+a")).toBe(false);
  });

  it("allows extra modifiers when exact=false", async () => {
    const ev = new KeyboardEvent("keydown", {
      key: "a",
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    });

    expect(match(ev, "ctrl+a", { exact: false })).toBe(true);
  });

  it("normalizes event key (Esc→escape) for matching", async () => {
    const ev = new KeyboardEvent("keydown", {
      key: "Esc",
      ctrlKey: true,
    });

    expect(match(ev, "ctrl+escape")).toBe(true);
  });

  it("treats meta as ctrl on mac", async () => {
    isMac = true;
    const ev = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
    });

    expect(match(ev, "ctrl+k")).toBe(true);
  });
});
