import { describe, expect, it } from "vitest";

describe("shortcut utils > normalizeEventKey (event.code-based)", () => {
  it("maps letter/digit/punctuation codes to normalized keys", async () => {
    const { normalizeEventKey } = await import("./normalize.js");
    expect(normalizeEventKey("KeyA")).toBe("a");
    expect(normalizeEventKey("Digit9")).toBe("9");
    expect(normalizeEventKey("Comma")).toBe(",");
  });

  it("maps Escape and Space codes to normalized keys", async () => {
    const { normalizeEventKey } = await import("./normalize.js");
    expect(normalizeEventKey("Escape")).toBe("escape");
    expect(normalizeEventKey("Space")).toBe("space");
  });
});
