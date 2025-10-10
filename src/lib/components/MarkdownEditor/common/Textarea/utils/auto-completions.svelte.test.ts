/* @canonical/generator-ds 0.10.0-experimental.2 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { autoCompletions } from "./auto-completions.js";

describe("Textarea Auto Completions", () => {
  const originalExec = (document as unknown as { execCommand?: unknown })
    .execCommand as unknown as ((...args: unknown[]) => unknown) | undefined;

  beforeEach(() => {
    (document as unknown as { execCommand: unknown }).execCommand = vi
      .fn()
      .mockImplementation(() => {
        throw new Error("unsupported");
      });
  });

  afterEach(() => {
    (document as unknown as { execCommand?: unknown }).execCommand =
      originalExec as unknown;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  describe("List Continuation", () => {
    it("continues unordered list with '-'", () => {
      const ta = document.createElement("textarea");
      ta.value = "- Item";
      ta.setSelectionRange(6, 6);

      const applied = autoCompletions(ta);
      expect(applied).toBe(true);
      expect(ta.value).toBe("- Item\n- ");
      expect(ta.selectionStart).toBe(6 + "\n- ".length);
    });

    it("continues unordered list with indentation", () => {
      const ta = document.createElement("textarea");
      ta.value = "  - Item";
      ta.setSelectionRange(8, 8);

      const applied = autoCompletions(ta);
      expect(applied).toBe(true);
      expect(ta.value).toBe("  - Item\n  - ");
    });

    it("continues todo list '- [ ]'", () => {
      const ta = document.createElement("textarea");
      ta.value = "- [ ] Task";
      ta.setSelectionRange(11, 11);

      const applied = autoCompletions(ta);
      expect(applied).toBe(true);
      expect(ta.value).toBe("- [ ] Task\n- [ ] ");
    });

    it("exits unordered list on empty content", () => {
      const ta = document.createElement("textarea");
      ta.value = "Hello\n- ";
      ta.setSelectionRange(8, 8); // end of last line

      const applied = autoCompletions(ta);
      expect(applied).toBe(true);
      // entire list marker line removed
      expect(ta.value).toBe("Hello\n");
    });

    it("exits todo list on empty content '- [ ]'", () => {
      const ta = document.createElement("textarea");
      ta.value = "Hello\n- [ ] ";
      ta.setSelectionRange(12, 12);

      const applied = autoCompletions(ta);
      expect(applied).toBe(true);
      expect(ta.value).toBe("Hello\n");
    });

    it("continues ordered list incrementing index", () => {
      const ta = document.createElement("textarea");
      ta.value = "1. First";
      ta.setSelectionRange(8, 8);

      const applied = autoCompletions(ta);
      expect(applied).toBe(true);
      expect(ta.value).toBe("1. First\n2. ");
    });
  });

  describe("Code Block Continuation", () => {
    it("inserts closing fence when opening is unmatched", () => {
      const ta = document.createElement("textarea");
      ta.value = "First line\n```";
      ta.setSelectionRange(ta.value.length, ta.value.length);

      const applied = autoCompletions(ta);
      expect(applied).toBe(true);
      expect(ta.value).toBe("First line\n```\n\n```");
      // cursor moved by +1
      expect(ta.selectionStart).toBe("First line\n```".length + 1);
    });

    it("does not insert when code block is already closed", () => {
      const ta = document.createElement("textarea");
      ta.value = "```\ncode\n```";
      // caret at end
      ta.setSelectionRange(ta.value.length, ta.value.length);

      const applied = autoCompletions(ta);
      expect(applied).toBe(false);
      expect(ta.value).toBe("```\ncode\n```");
    });
  });
});
