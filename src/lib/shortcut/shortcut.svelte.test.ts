import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { Shortcut } from "./shortcut.js";
import type { MacShortcut, StandardShortcut } from "./type.js";

const noop = () => {};

// Utility to spoof platform for mac/non-mac specific behavior
const originalPlatformDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "platform",
);

function setPlatform(value: string) {
  Object.defineProperty(window.navigator, "platform", {
    value,
    configurable: true,
  });
}

afterAll(() => {
  if (originalPlatformDescriptor) {
    Object.defineProperty(
      window.navigator,
      "platform",
      originalPlatformDescriptor,
    );
  }
});

beforeEach(() => {
  setPlatform("Linux x86_64");
});

describe("Shortcut class > normalize (via match/event.code)", () => {
  it("maps letter/digit/punctuation codes to normalized keys", () => {
    const s1 = new Shortcut("a", "Label", noop);
    const s2 = new Shortcut("9", "Label", noop);
    const s3 = new Shortcut(",", "Label", noop);

    expect(
      s1.match(
        new KeyboardEvent("keydown", {
          code: "KeyA",
        }),
      ),
    ).toBe(true);

    expect(
      s2.match(
        new KeyboardEvent("keydown", {
          code: "Digit9",
        }),
      ),
    ).toBe(true);

    expect(
      s3.match(
        new KeyboardEvent("keydown", {
          code: "Comma",
        }),
      ),
    ).toBe(true);
  });

  it("maps Escape and Space codes to normalized keys", () => {
    const esc = new Shortcut(
      "ctrl+escape",

      "Label",
      noop,
    );
    const space = new Shortcut(
      "space",

      "Label",
      noop,
    );

    expect(
      esc.match(
        new KeyboardEvent("keydown", {
          code: "Escape",
          ctrlKey: true,
        }),
      ),
    ).toBe(true);

    expect(
      space.match(
        new KeyboardEvent("keydown", {
          code: "Space",
        }),
      ),
    ).toBe(true);
  });
});

describe("Shortcut class > parse", () => {
  it("returns modifiers and key; maps ctrl->ctrl on non-mac", () => {
    setPlatform("Linux x86_64");
    const s = new Shortcut(
      "ctrl+alt+z",

      "Label",
      noop,
    );
    expect(s.shortcut).toEqual(["ctrl", "alt", "z"]);
  });

  it("maps ctrl->cmd on mac when no explicit mac override is provided", () => {
    setPlatform("MacIntel");
    const s = new Shortcut("ctrl+k", "Label", noop);
    expect(s.shortcut).toEqual(["cmd", "k"]);
  });

  it("uses explicit mac override when provided (mac)", () => {
    setPlatform("MacIntel");
    const s = new Shortcut("ctrl+alt+z", "cmd+option+x", "Label", noop);
    expect(s.shortcut).toEqual(["cmd", "option", "x"]);
  });

  it("falls back to standard mapping when mac override is absent (mac)", () => {
    setPlatform("MacIntel");
    const s = new Shortcut(
      "ctrl+shift+k",

      "Label",
      noop,
    );
    expect(s.shortcut).toEqual(["cmd", "shift", "k"]);
  });

  it("ignores mac override on non-mac", () => {
    setPlatform("Linux x86_64");
    const s = new Shortcut("ctrl+alt+z", "cmd+option+x", "Label", noop);
    expect(s.shortcut).toEqual(["ctrl", "alt", "z"]);
  });

  it("throws when key is missing", () => {
    setPlatform("Linux x86_64");
    // parse() runs in constructor
    expect(
      () =>
        new Shortcut(
          "ctrl+" as unknown as StandardShortcut,

          "Label",
          noop,
        ),
    ).toThrowError(/Invalid shortcut, missing key/i);
  });

  it("throws when mac override is missing key on mac", () => {
    setPlatform("MacIntel");
    expect(
      () =>
        new Shortcut("ctrl+k", "cmd+" as unknown as MacShortcut, "Label", noop),
    ).toThrowError(/Invalid shortcut, missing mac key/i);
  });
});

describe("Shortcut class > match", () => {
  it("matches exact by default and rejects extra modifiers", () => {
    const s = new Shortcut(
      "ctrl+a",

      "Label",
      noop,
    );
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
      shiftKey: true,
    });
    expect(s.match(ev)).toBe(false);
  });

  it("allows extra modifiers when exact=false", () => {
    const s = new Shortcut(
      "ctrl+a",

      "Label",
      noop,
    );
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    });
    expect(s.match(ev, { exact: false })).toBe(true);
  });

  it("normalizes event key (Esc→escape) for matching", () => {
    const s = new Shortcut(
      "ctrl+escape",

      "Label",
      noop,
    );
    const ev = new KeyboardEvent("keydown", {
      code: "Escape",
      ctrlKey: true,
    });
    expect(s.match(ev)).toBe(true);
  });

  it("treats ctrl as cmd on mac (metaKey)", () => {
    setPlatform("MacIntel");
    const s = new Shortcut(
      "ctrl+k",

      "Label",
      noop,
    );
    const ev = new KeyboardEvent("keydown", {
      code: "KeyK",
      metaKey: true,
    });
    expect(s.match(ev)).toBe(true);
  });

  it("cmd matches ctrl shortcuts on mac (ctrlKey)", () => {
    setPlatform("MacIntel");
    const s = new Shortcut(
      "ctrl+a",

      "Label",
      noop,
    );
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      ctrlKey: true,
    });
    expect(s.match(ev)).toBe(true);
  });

  it("doesn't treat ctrl as cmd when a mac specific shortcut is used", () => {
    setPlatform("MacIntel");
    const s = new Shortcut("ctrl+k", "cmd+l", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyK",
      ctrlKey: true,
    });
    expect(s.match(ev)).toBe(false);
  });

  it("option matches on mac altKey", () => {
    setPlatform("MacIntel");
    const s = new Shortcut("ctrl+alt+a", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      altKey: true,
      ctrlKey: true,
    });
    expect(s.match(ev)).toBe(true);
  });

  it("shift matches on mac with shiftKey", () => {
    setPlatform("MacIntel");
    const s = new Shortcut("ctrl+shift+a", "Label", noop);
    const ev = new KeyboardEvent("keydown", {
      code: "KeyA",
      shiftKey: true,
      ctrlKey: true,
    });
    expect(s.match(ev)).toBe(true);
  });
});
