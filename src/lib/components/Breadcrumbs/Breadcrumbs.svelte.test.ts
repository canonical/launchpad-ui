/* @canonical/generator-ds 0.9.1-experimental.0 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Breadcrumbs.svelte";

describe("Breadcrumbs component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Breadcrumbs`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("Breadcrumbs");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Breadcrumbs`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByText("Breadcrumbs");
    await expect.element(element).toHaveClass("test-class");
  });
});
