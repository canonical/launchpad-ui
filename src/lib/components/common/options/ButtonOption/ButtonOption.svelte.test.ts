/* @canonical/generator-ds 0.10.0-experimental.5 */

import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./ButtonOption.svelte";

describe("ButtonOption component", () => {
  const baseProps = {
    text: "Button Option",
  } satisfies ComponentProps<typeof Component>;

  describe("Renders", () => {
    it("renders", async () => {
      const page = render(Component, baseProps);
      const element = componentLocator(page);
      await expect.element(element).toBeInTheDocument();
      await expect.element(page.getByText("Button Option")).toBeVisible();
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
      await expect.element(element).toHaveClass("button-option");
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

  describe("Disabled state", () => {
    it("is not disabled by default", async () => {
      const page = render(Component, baseProps);
      await expect.element(componentLocator(page)).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { ...baseProps, disabled: true });
      await expect.element(componentLocator(page)).toBeDisabled();
    });
  });

  it("fires click handler", async () => {
    const onclick = vi.fn();
    const page = render(Component, { ...baseProps, onclick });
    await componentLocator(page).click();
    expect(onclick).toHaveBeenCalled();
  });

  it("can have type set", async () => {
    const page = render(Component, { ...baseProps, type: "submit" });
    await expect
      .element(componentLocator(page))
      .toHaveAttribute("type", "submit");
  });

  it("renders as link when href is provided", async () => {
    const page = render(Component, {
      ...baseProps,
      href: "https://example.com",
    });
    await expect
      .element(page.getByRole("link"))
      .toHaveAttribute("href", "https://example.com");
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button");
}
