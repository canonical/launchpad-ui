/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./MarkdownEditor.svelte";

describe("MarkdownEditor component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>MarkdownEditor</span>`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("MarkdownEditor");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>MarkdownEditor</span>`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = testIdLocator(page);
    await expect.element(element).toHaveClass("test-class");
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("markdown-editor");
}
