import { beforeEach, describe, expect, it, vi } from "vitest";
import { Shortcut } from "./Shortcut.svelte.js";
import type { MacShortcut, StandardShortcut } from "./type.js";

let isMac = vi.hoisted(() => false);
vi.mock("./utils.js", async (importActual) => {
  const actual = await importActual<typeof import("./utils.js")>();
  return {
    ...actual,
    isMacPlatform: () => isMac,
  };
});

const noop = () => {};

beforeEach(() => {
  isMac = false;
});

describe("Shortcut class > normalize (via match/event.code)", () => {
  it("maps letter/digit/punctuation codes to normalized keys", () => {
    const s1 = new Shortcut("a", "Label", noop);
    const s2 = new Shortcut("9", "Label", noop);
    const s3 = new Shortcut(",", "Label", noop);

    expect(
      s1.matches(
        new KeyboardEvent("keydown", {
          code: "KeyA",
        }),
      ),
    ).toBe(true);

    expect(
      s2.matches(
        new KeyboardEvent("keydown", {
          code: "Digit9",
        }),
      ),
    ).toBe(true);

    expect(
      s3.matches(
        new KeyboardEvent("keydown", {
          code: "Comma",
        }),
      ),
    ).toBe(true);
  });

  it("maps Escape and Space codes to normalized keys", () => {
    const esc = new Shortcut("ctrl+escape", "Label", noop);
    const space = new Shortcut("space", "Label", noop);

    expect(
      esc.matches(
        new KeyboardEvent("keydown", {
          code: "Escape",
          ctrlKey: true,
        }),
      ),
    ).toBe(true);

    expect(
      space.matches(
        new KeyboardEvent("keydown", {
          code: "Space",
        }),
      ),
    ).toBe(true);
  });
});

describe("Shortcut class > parse", () => {
  it("returns modifiers and key; maps ctrl->ctrl on non-mac", () => {
    const s = new Shortcut("ctrl+alt+z", "Label", noop);
    expect(s.parsedShortcut).toEqual(["ctrl", "alt", "z"]);
  });

  it("maps ctrl->cmd on mac when no explicit mac override is provided", () => {
    isMac = true;
    const s = new Shortcut("ctrl+k", "Label", noop);
    expect(s.parsedShortcut).toEqual(["cmd", "k"]);
  });

  it("uses explicit mac override when provided (mac)", () => {
    isMac = true;
    const s = new Shortcut(["ctrl+alt+z", "cmd+option+x"], "Label", noop);
    expect(s.parsedShortcut).toEqual(["cmd", "option", "x"]);
  });

  it("falls back to standard mapping when mac override is absent (mac)", () => {
    isMac = true;
    const s = new Shortcut("ctrl+shift+k", "Label", noop);
    expect(s.parsedShortcut).toEqual(["cmd", "shift", "k"]);
  });

  it("ignores mac override on non-mac", () => {
    const s = new Shortcut(["ctrl+alt+z", "cmd+option+x"], "Label", noop);
    expect(s.parsedShortcut).toEqual(["ctrl", "alt", "z"]);
  });

  it("throws when key is missing", () => {
    // parse() runs in constructor
    expect(
      () => new Shortcut("ctrl+" as unknown as StandardShortcut, "Label", noop),
    ).toThrowError(/Invalid shortcut, invalid key ''/i);
  });

  it("throws when mac override is missing key on mac", () => {
    isMac = true;
    expect(
      () =>
        new Shortcut(
          ["ctrl+k", "cmd+" as unknown as MacShortcut],
          "Label",
          noop,
        ),
    ).toThrowError(/Invalid shortcut, invalid mac key ''/i);
  });
});

describe("Shortcut class > match", () => {
  it("matches exact by default and rejects extra modifiers", () => {
    const s = new Shortcut("ctrl+a", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
      shiftKey: true,
    });
    expect(s.matches(ev)).toBe(false);
  });

  it("allows extra modifiers when exact=false", () => {
    const s = new Shortcut("ctrl+a", "Label", noop, { exact: false });
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    });
    expect(s.matches(ev)).toBe(true);
  });

  it("normalizes event key (Esc→escape) for matching", () => {
    const s = new Shortcut("ctrl+escape", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "Escape",
      ctrlKey: true,
    });
    expect(s.matches(ev)).toBe(true);
  });

  it("treats ctrl as cmd on mac (metaKey)", () => {
    isMac = true;
    const s = new Shortcut(
      "ctrl+k",

      "Label",
      noop,
    );
    const ev = new KeyboardEvent("keydown", {
      code: "KeyK",
      metaKey: true,
    });
    expect(s.matches(ev)).toBe(true);
  });

  it("cmd matches ctrl shortcuts on mac (ctrlKey)", () => {
    isMac = true;
    const s = new Shortcut("ctrl+a", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
    });
    expect(s.matches(ev)).toBe(true);
  });

  it("doesn't treat ctrl as cmd when a mac specific shortcut is used", () => {
    isMac = true;
    const s = new Shortcut(["ctrl+k", "cmd+l"], "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyK",
      ctrlKey: true,
    });
    expect(s.matches(ev)).toBe(false);
  });

  it("option matches on mac altKey", () => {
    isMac = true;
    const s = new Shortcut("ctrl+alt+a", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      altKey: true,
      ctrlKey: true,
    });
    expect(s.matches(ev)).toBe(true);
  });

  it("shift matches on mac with shiftKey", () => {
    isMac = true;
    const s = new Shortcut("ctrl+shift+a", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      shiftKey: true,
      ctrlKey: true,
    });
    expect(s.matches(ev)).toBe(true);
  });

  it("doesn't match when disabled", () => {
    const s = new Shortcut("a", "Label", noop, {}, false);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
    });
    expect(s.matches(ev)).toBe(false);
    // Matches again when enabled
    s.enabled = true;
    expect(s.matches(ev)).toBe(true);
  });

  it("doesn't match when predicate returns false", () => {
    const s = new Shortcut(
      "a",
      "Label",
      noop,
      {
        predicate: (e) => e.repeat,
      },
      true,
    );
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      repeat: false,
    });
    expect(s.matches(ev)).toBe(false);
    const ev2 = new KeyboardEvent("keydown", {
      code: "KeyA",
      repeat: true,
    });
    expect(s.matches(ev2)).toBe(true);
  });
});
