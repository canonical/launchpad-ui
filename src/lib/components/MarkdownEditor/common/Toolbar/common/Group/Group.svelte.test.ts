/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Group.svelte";

describe("Markdown Editor > Toolbar > Group component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Group</span>`,
    }));

    const page = render(Component, { children });
    const element = page.getByRole("group");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Group</span>`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByRole("group");
    await expect.element(element).toHaveClass("test-class");
  });
});
