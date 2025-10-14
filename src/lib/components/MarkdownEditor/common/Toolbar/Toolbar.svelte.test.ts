/* @canonical/generator-ds 0.10.0-experimental.3 */

import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Toolbar.svelte";

const textareaId = ":c1:";
vi.mock("../../context.js", () => {
  return {
    getMarkdownEditorContext: () => ({
      textareaId,
    }),
  };
});

describe("Markdown Editor > Toolbar component", () => {
  it("renders", async () => {
    const page = render(Component);
    const element = page.getByRole("toolbar");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const page = render(Component, {
      class: "test-class",
    });
    const element = page.getByRole("toolbar");
    await expect.element(element).toHaveClass("test-class");
  });

  it("applies aria-controls", async () => {
    const page = render(Component);
    const element = page.getByRole("toolbar");
    await expect.element(element).toHaveAttribute("aria-controls", textareaId);
  });
});
