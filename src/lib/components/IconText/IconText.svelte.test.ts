/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./IconText.svelte";

describe("IconText component", () => {
  const children = createRawSnippet(() => ({
    render: () => `<Text>Text</Text>`,
  }));

  const icon = createRawSnippet(() => ({
    render: () => "<span>Icon</span>",
  }));

  it("renders", async () => {
    const page = render(Component, {
      icon,
      children,
    });

    const textElement = page.getByText("Text");
    await expect.element(textElement).toBeInTheDocument();

    const iconElement = page.getByText("Icon");
    await expect.element(iconElement).toBeInTheDocument();
  });

  it("applies class", async () => {
    const page = render(Component, {
      icon,
      children,
      class: "test-class",
    });

    const element = page.getByTestId("icon-text");
    await expect.element(element).toHaveClass("test-class");
  });
});
