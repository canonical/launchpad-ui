/* @canonical/generator-ds 0.10.0-experimental.2 */

import { beforeEach, describe, expect, it } from "vitest";
import { calculateDynamicRows } from "./calculateDynamicRows.js";

describe("Textarea > calculateDynamicRows", () => {
  let textarea: HTMLTextAreaElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
  });

  describe("Basic functionality", () => {
    it("returns default rows when content has fewer lines", () => {
      textarea.value = "Single line content";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });

    it("returns default rows when content has exactly default rows", () => {
      textarea.value = "Line 1\nLine 2\nLine 3";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });

    it("returns actual line count when between default and max rows", () => {
      textarea.value = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(5);
    });

    it("returns max rows when content exceeds max rows", () => {
      textarea.value =
        "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(10);
    });
  });

  describe("Edge cases", () => {
    it("handles empty textarea", () => {
      textarea.value = "";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });

    it("handles single line content", () => {
      textarea.value = "Just one line";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });

    it("handles content with only newlines", () => {
      textarea.value = "\n\n\n";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(4); // 4 lines: empty, empty, empty, empty
    });

    it("handles very long single line with no newlines", () => {
      textarea.value =
        "This is a very long line with no newlines that should still be counted as one line";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });

    it("handles content exactly at max rows", () => {
      textarea.value = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5";
      const result = calculateDynamicRows(textarea, 3, 5);
      expect(result).toBe(5);
    });
  });

  describe("Boundary conditions", () => {
    it("handles when default rows equals max rows", () => {
      textarea.value = "Line 1\nLine 2\nLine 3\nLine 4";
      const result = calculateDynamicRows(textarea, 3, 3);
      expect(result).toBe(3);
    });

    it("handles when content lines equal default rows", () => {
      textarea.value = "Line 1\nLine 2\nLine 3";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });

    it("handles when content lines equal max rows", () => {
      textarea.value = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5";
      const result = calculateDynamicRows(textarea, 3, 5);
      expect(result).toBe(5);
    });
  });

  describe("Special content scenarios", () => {
    it("handles content with trailing newline", () => {
      textarea.value = "Line 1\nLine 2\nLine 3\n";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(4); // 4 lines including the trailing empty line
    });

    it("handles content with leading newline", () => {
      textarea.value = "\nLine 1\nLine 2\nLine 3";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(4); // 4 lines including the leading empty line
    });

    it("handles content with multiple consecutive newlines", () => {
      textarea.value = "Line 1\n\n\nLine 4";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(4); // 4 lines: Line 1, empty, empty, Line 4
    });

    it("handles mixed line lengths", () => {
      textarea.value =
        "Short\nThis is a much longer line that might wrap\nAnother short line";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });

    it("handles content with special characters", () => {
      textarea.value =
        "Line with special chars: !@#$%^&*()\nLine with unicode: 🚀\nNormal line";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(3);
    });
  });

  describe("Performance and limits", () => {
    it("handles large content efficiently", () => {
      // Create content with many lines but within maxRows
      const lines = Array(8)
        .fill(0)
        .map((_, i) => `Line ${i + 1}`);
      textarea.value = lines.join("\n");
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(8);
    });

    it("stops counting at maxRows limit for very large content", () => {
      // Create content with more lines than maxRows
      const lines = Array(15)
        .fill(0)
        .map((_, i) => `Line ${i + 1}`);
      textarea.value = lines.join("\n");
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(10);
    });
  });

  describe("Real-world scenarios", () => {
    it("handles markdown content with headers and lists", () => {
      textarea.value =
        "# Header\n\n- Item 1\n- Item 2\n\n## Subheader\n\nSome text";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(8);
    });

    it("handles mixed content with empty lines", () => {
      textarea.value =
        "First paragraph\n\nSecond paragraph\n\n\nThird paragraph";
      const result = calculateDynamicRows(textarea, 3, 10);
      expect(result).toBe(6);
    });
  });
});
