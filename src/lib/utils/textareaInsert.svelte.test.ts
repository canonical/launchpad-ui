/* @canonical/generator-ds 0.10.0-experimental.2 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { textareaInsert } from "./textareaInsert.js";

describe("textareaInsert", () => {
  const originalExec = (document as unknown as { execCommand?: unknown })
    .execCommand as unknown as ((...args: unknown[]) => unknown) | undefined;

  beforeEach(() => {
    // Default: force fallback path by throwing from execCommand
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

  it("inserts at caret and applies provided selection range", () => {
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.value = "HelloWorld";
    ta.setSelectionRange(5, 5); // Hello|World

    textareaInsert(ta, { text: " ", selectionStart: 6, selectionEnd: 6 });

    expect(ta.value).toBe("Hello World");
    expect(ta.selectionStart).toBe(6);
    expect(ta.selectionEnd).toBe(6);
  });

  it("replaces selection and dispatches input event on fallback", () => {
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.value = "Hello brave World";
    // Select "brave"
    ta.setSelectionRange(6, 11);

    let inputFired = false;
    ta.addEventListener("input", () => {
      inputFired = true;
    });

    textareaInsert(ta, { text: "big" });

    expect(ta.value).toBe("Hello big World");
    expect(inputFired).toBe(true);
    expect(ta.selectionStart).toBe(6);
  });

  it("falls back when execCommand returns true but no text inserted", () => {
    (document as unknown as { execCommand: unknown }).execCommand = vi
      .fn()
      .mockReturnValue(true);

    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.value = "abcdn".replace("n", ""); // "abcd"
    ta.setSelectionRange(2, 2); // ab|cd

    textareaInsert(ta, { text: "X" });

    expect(ta.value).toBe("abXcd");
  });
});
