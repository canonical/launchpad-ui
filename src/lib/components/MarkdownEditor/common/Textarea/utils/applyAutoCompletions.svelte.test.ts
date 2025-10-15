/* @canonical/generator-ds 0.10.0-experimental.2 */

import { beforeEach, describe, expect, it } from "vitest";
import {
  applyAutoCompletions,
  applyCodeBlockContinuation,
  applyListContinuation,
  parseLines,
} from "./applyAutoCompletions.js";
import type { Line } from "./applyAutoCompletions.js";

describe("Textarea > applyAutoCompletions", () => {
  let textarea: HTMLTextAreaElement;
  let lines: Line[];
  beforeEach(() => {
    document.body.innerHTML = "";
    textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    lines = parseLines(textarea);
  });

  const setText = (ta: HTMLTextAreaElement, text: string) => {
    ta.value = text;
    ta.setSelectionRange(ta.value.length, ta.value.length);
    lines = parseLines(ta);
  };

  describe("List Continuation", () => {
    it("continues unordered list with '-'", () => {
      setText(textarea, "- Item");

      const applied = applyListContinuation(textarea, lines);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("- Item\n- ");
      expect(textarea.selectionStart).toBe(6 + "\n- ".length);
    });

    it("continues unordered list with indentation", () => {
      setText(textarea, "  - Item");

      const applied = applyListContinuation(textarea, lines);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("  - Item\n  - ");
    });

    it("continues todo list '- [ ]'", () => {
      setText(textarea, "- [ ] Task");

      const applied = applyListContinuation(textarea, lines);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("- [ ] Task\n- [ ] ");
    });

    it("exits unordered list on empty content", () => {
      setText(textarea, "Hello\n- ");

      const applied = applyListContinuation(textarea, lines);
      expect(applied).toBe(true);
      // entire list marker line removed
      expect(textarea.value).toBe("Hello\n\n");
    });

    it("exits todo list on empty content '- [ ]'", () => {
      setText(textarea, "Hello\n- [ ] ");

      const applied = applyListContinuation(textarea, lines);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("Hello\n\n");
    });

    it("continues ordered list incrementing index", () => {
      setText(textarea, "1. First");

      const applied = applyListContinuation(textarea, lines);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("1. First\n2. ");
    });

    it("triggering a continuation should keep the textarea editable", () => {
      setText(textarea, "- ");

      const applied = applyListContinuation(textarea, lines);
      expect(applied).toBe(true);
    });
  });

  describe("Code Block Continuation", () => {
    it("inserts closing fence when opening is unmatched", () => {
      setText(textarea, "First line\n  ```");

      const applied = applyCodeBlockContinuation(textarea, lines);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("First line\n  ```\n\n  ```");
      expect(textarea.selectionStart).toBe(17); // First line\n  ```\n|\n  ```
    });

    it("does not insert when code block is already closed", () => {
      setText(textarea, "```\ncode\n```");

      const applied = applyCodeBlockContinuation(textarea, lines);
      expect(applied).toBe(false);
      expect(textarea.value).toBe("```\ncode\n```");
    });
  });

  describe("applyAutoCompletions", () => {
    it("applies list continuation when Enter is pressed on a list item line", () => {
      setText(textarea, "- ");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
    });

    it("applies code block continuation when Enter is pressed on a code block opening line", () => {
      setText(textarea, "```");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
    });

    it("returns false when no continuation is applied", () => {
      setText(textarea, "Hello");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(false);
    });
  });
});
