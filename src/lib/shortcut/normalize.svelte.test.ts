import { describe, expect, it } from "vitest";

describe("shortcut utils > normalizeEventKey", () => {
  it("normalizes letter/digit/punctuation as-is and lowercases", async () => {
    const { normalizeEventKey } = await import("./normalize.js");
    expect(normalizeEventKey("A")).toBe("a");
    expect(normalizeEventKey("9")).toBe("9");
    expect(normalizeEventKey(",")).toBe(",");
  });

  it("maps 'Esc' to 'escape' and space to 'space'", async () => {
    const { normalizeEventKey } = await import("./normalize.js");
    expect(normalizeEventKey("Esc")).toBe("escape");
    expect(normalizeEventKey(" ")).toBe("space");
  });
});
