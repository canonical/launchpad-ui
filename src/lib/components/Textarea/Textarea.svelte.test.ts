/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Textarea.svelte";

describe("Textarea component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Textarea`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("Textarea");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Textarea`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByText("Textarea");
    await expect.element(element).toHaveClass("test-class");
  });
});
