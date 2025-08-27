/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./TitleRow.svelte";

describe("TitleRow component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `TitleRow`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("TitleRow");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `TitleRow`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByText("TitleRow");
    await expect.element(element).toHaveClass("test-class");
  });
});
