/* @canonical/generator-ds 0.9.0-experimental.22 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Button.svelte";

describe("Button component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Button`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("Button");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Button`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByText("Button");
    await expect.element(element).toHaveClass("test-class");
  });
});
