/* @canonical/generator-ds 0.10.0-experimental.5 */

import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./LinkOption.svelte";

describe("LinkOption component", () => {
  const baseProps = {
    text: "Option",
    href: "#",
  } satisfies ComponentProps<typeof Component>;

  describe("Renders", () => {
    it("renders", async () => {
      const page = render(Component, baseProps);
      await expect.element(componentLocator(page)).toBeInTheDocument();
    });

    it("renders secondary text", async () => {
      const page = render(Component, {
        ...baseProps,
        secondaryText: "Secondary",
      });
      await expect.element(page.getByText("Secondary")).toBeInTheDocument();
    });

    it("renders trailing text", async () => {
      const page = render(Component, {
        ...baseProps,
        trailingText: "Trailing",
      });
      await expect.element(page.getByText("Trailing")).toBeInTheDocument();
    });

    it("renders icon", async () => {
      const icon = "<span data-testid='icon'>Icon</span>";
      const page = render(Component, {
        ...baseProps,
        icon: createRawSnippet(() => ({ render: () => icon })),
      });
      await expect.element(page.getByTestId("icon")).toBeInTheDocument();
    });
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, value) => {
      const page = render(Component, { ...baseProps, [attribute]: value });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, value);
    });

    it("applies class", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      await expect.element(element).toHaveClass("ds");
      await expect.element(element).toHaveClass("link-option");
      await expect.element(element).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      await expect
        .element(componentLocator(page))
        .toHaveStyle("color: orange;");
    });
  });

  describe("Link-specific", () => {
    it("has correct href", async () => {
      const page = render(Component, {
        ...baseProps,
        href: "https://example.com",
      });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("href", "https://example.com");
    });

    it("is not disabled by default", async () => {
      const page = render(Component, baseProps);
      await expect.element(componentLocator(page)).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, {
        ...baseProps,
        disabled: true,
      });
      await expect.element(componentLocator(page)).toBeDisabled();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("link");
}
