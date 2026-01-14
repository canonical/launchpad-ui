/* @canonical/generator-ds 0.10.0-experimental.5 */

import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Button.svelte";

describe("Button component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      await expect.element(componentLocator(page)).toHaveClass("test-class");
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect.element(componentLocator(page)).toHaveClass("button");
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      await expect
        .element(componentLocator(page))
        .toHaveStyle({ color: "orange" });
    });

    it("applies type", async () => {
      const page = render(Component, {
        ...baseProps,
        type: "submit",
      });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("type", "submit");
    });
  });

  describe("interactions", () => {
    it("is enabled by default", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(componentLocator(page)).toBeEnabled();
    });

    it("emits click event when clicked", async () => {
      const onclick = vi.fn();
      const page = render(Component, {
        ...baseProps,
        onclick,
      });
      await componentLocator(page).click();
      expect(onclick).toHaveBeenCalledOnce();
    });

    it("is disabled when prop is set", async () => {
      const page = render(Component, { ...baseProps, disabled: true });
      await expect.element(componentLocator(page)).toBeDisabled();
    });

    it("is disabled when in loading state", async () => {
      const page = render(Component, { ...baseProps, loading: true });
      await expect.element(componentLocator(page)).toBeDisabled();
    });
  });

  describe("content", () => {
    it("renders children content", async () => {
      const page = render(Component, {
        ...baseProps,
        children: createRawSnippet(() => ({
          render: () => "<span>Click me</span>",
        })),
      });
      await expect
        .element(componentLocator(page))
        .toHaveTextContent("Click me");
    });

    it("renders iconLeft when provided", async () => {
      const page = render(Component, {
        ...baseProps,
        iconLeft: createRawSnippet(() => ({
          render: () => "<span>Icon</span>",
        })),
      });
      await expect
        .element(componentLocator(page))
        .toContainHTML("<span>Icon</span>");
    });

    it("renders iconRight when provided", async () => {
      const page = render(Component, {
        ...baseProps,
        iconRight: createRawSnippet(() => ({
          render: () => "<span>Icon</span>",
        })),
      });
      await expect
        .element(componentLocator(page))
        .toContainHTML("<span>Icon</span>");
    });

    it("renders all content together", async () => {
      const page = render(Component, {
        ...baseProps,
        children: createRawSnippet(() => ({
          render: () => "<span>Click me</span>",
        })),
        iconLeft: createRawSnippet(() => ({
          render: () => "<span class='icon-left'>Icon</span>",
        })),
        iconRight: createRawSnippet(() => ({
          render: () => "<span class='icon-right'>Icon</span>",
        })),
      });
      await expect
        .element(componentLocator(page))
        .toContainHTML("<span>Click me</span>");
      await expect
        .element(componentLocator(page))
        .toContainHTML("<span class='icon-left'>Icon</span>");
      await expect
        .element(componentLocator(page))
        .toContainHTML("<span class='icon-right'>Icon</span>");
    });

    it("renders spinner when loading", async () => {
      const page = render(Component, {
        ...baseProps,
        loading: true,
      });
      await expect.element(componentLocator(page)).toHaveClass("loading");
    });

    it("hides content when loading", async () => {
      const page = render(Component, {
        ...baseProps,
        loading: true,
        children: createRawSnippet(() => ({
          render: () => "<span>Click me</span>",
        })),
      });
      const element = page.getByText("Click me");
      await expect.element(element).not.toBeVisible();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button");
}
