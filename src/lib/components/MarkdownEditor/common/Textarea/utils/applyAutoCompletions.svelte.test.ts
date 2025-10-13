/* @canonical/generator-ds 0.10.0-experimental.2 */

import { beforeEach, describe, expect, it } from "vitest";
import { applyAutoCompletions } from "./applyAutoCompletions.js";

describe("Textarea > applyAutoCompletions", () => {
  let textarea: HTMLTextAreaElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
  });

  const setText = (ta: HTMLTextAreaElement, text: string) => {
    ta.value = text;
    ta.setSelectionRange(ta.value.length, ta.value.length);
  };

  describe("List Continuation", () => {
    it("continues unordered list with '-'", () => {
      setText(textarea, "- Item");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("- Item\n- ");
      expect(textarea.selectionStart).toBe(6 + "\n- ".length);
    });

    it("continues unordered list with indentation", () => {
      setText(textarea, "  - Item");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("  - Item\n  - ");
    });

    it("continues todo list '- [ ]'", () => {
      setText(textarea, "- [ ] Task");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("- [ ] Task\n- [ ] ");
    });

    it("exits unordered list on empty content", () => {
      setText(textarea, "Hello\n- ");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
      // entire list marker line removed
      expect(textarea.value).toBe("Hello\n\n");
    });

    it("exits todo list on empty content '- [ ]'", () => {
      setText(textarea, "Hello\n- [ ] ");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("Hello\n\n");
    });

    it("continues ordered list incrementing index", () => {
      setText(textarea, "1. First");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("1. First\n2. ");
    });

    it("triggering a continuation should keep the textarea editable", () => {
      setText(textarea, "- ");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
    });
  });

  describe("Code Block Continuation", () => {
    it("inserts closing fence when opening is unmatched", () => {
      setText(textarea, "First line\n  ```");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(true);
      expect(textarea.value).toBe("First line\n  ```\n\n  ```");
      expect(textarea.selectionStart).toBe(17); // First line\n  ```\n|\n  ```
    });

    it("does not insert when code block is already closed", () => {
      setText(textarea, "```\ncode\n```");

      const applied = applyAutoCompletions(textarea);
      expect(applied).toBe(false);
      expect(textarea.value).toBe("```\ncode\n```");
    });
  });
});
