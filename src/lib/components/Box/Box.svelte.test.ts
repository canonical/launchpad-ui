/* @canonical/generator-ds 0.9.0-experimental.22 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Box.svelte";

describe("Box component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Box`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("Box");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Box`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByText("Box");
    await expect.element(element).toHaveClass("test-class");
  });
});
