/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./MarkdownEditor.svelte";

describe("MarkdownEditor component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `MarkdownEditor`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("MarkdownEditor");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `MarkdownEditor`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByText("MarkdownEditor");
    await expect.element(element).toHaveClass("test-class");
  });
});
