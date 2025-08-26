/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./IconText.svelte";
import { iconTextModifiers } from "./modifiers";

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

  describe("modifiers", () => {
    it.each(iconTextModifiers)(
      "renders with %s modifier class",
      async (modifier) => {
        const page = render(Component, {
          icon,
          children,
          modifiers: [modifier],
        });

        const element = page.getByTestId("icon-text");
        await expect.element(element).toHaveClass(modifier ?? "");
        const otherModifiers = iconTextModifiers
          .filter((m) => m !== modifier)
          .map((m) => m ?? "");
        await expect.element(element).not.toHaveClass(...otherModifiers);
      },
    );
  });
});
