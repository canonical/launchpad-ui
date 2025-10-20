/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import type { ComponentProps, Snippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Chip.svelte";

// Mock the Icon component to prevent testing its implementation details.
vi.mock("../Icon", () => ({
  Icon: (props: { name: string }) =>
    `<div data-testid="icon-${props.name}"></div>`,
}));

describe("Chip component", () => {
  const baseProps = {
    value: "Chip",
  } satisfies ComponentProps<typeof Component>;

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
      await expect.element(componentLocator(page)).toHaveClass("chip");
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
  });

  describe("Initial Rendering", () => {
    it("should render with default props as a non-interactive element", async () => {
      const page = render(Component, { value: "Default Chip" });

      await expect.element(page.getByRole("button")).not.toBeInTheDocument();
    });

    it("should render with a lead element", async () => {
      const page = render(Component, { lead: "Key", value: "Value" });

      await expect.element(page.getByText("Key")).toBeInTheDocument();
      await expect.element(page.getByText("Value")).toBeInTheDocument();
    });

    it("should render with an icon", async () => {
      const icon: Snippet = createRawSnippet(() => ({
        render: () => `<div data-testid="custom-icon"></div>`,
      }));
      const page = render(Component, { value: "Icon Chip", icon });

      await expect.element(page.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("should apply custom class and modifiers", async () => {
      const page = render(Component, {
        value: "Styled Chip",
        class: "extra-class",
        modifiers: { density: "dense", severity: "caution" },
      });

      await expect.element(componentLocator(page)).toHaveClass("extra-class");
      await expect.element(componentLocator(page)).toHaveClass("dense");
      await expect.element(componentLocator(page)).toHaveClass("caution");
    });

    it("should not render a button when dismiss is provided", async () => {
      const page = render(Component, {
        value: "Dismissible",
        ondismiss: () => {},
      });

      await expect
        .element(componentLocator(page))
        .not.toHaveAttribute("type", "button");
      await expect
        .element(page.getByRole("button"))
        .toHaveAccessibleName("Dismiss");
    });

    it("should not render a button when readonly is provided", async () => {
      const page = render(Component, {
        value: "Readonly",
        modifiers: { readMode: "readonly" },
        onclick: () => {},
      });

      await expect.element(componentLocator(page)).toBeInTheDocument();
      await expect.element(page.getByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Interactions & States", () => {
    it("should render a working button when onclick is provided", async () => {
      const onclick = vi.fn();
      const page = render(Component, { value: "Clickable", onclick });

      const element = page.getByRole("button");
      await expect.element(element).toBeInTheDocument();
      await element.click();
      expect(onclick).toHaveBeenCalled();
    });

    it("should render a working dismiss button when ondismiss is provided", async () => {
      const ondismiss = vi.fn();
      const page = render(Component, { value: "Dismissible", ondismiss });

      const dissmissButton = page.getByLabelText("Dismiss");
      await expect.element(dissmissButton).toBeInTheDocument();

      await expect.element(dissmissButton).toBeInTheDocument();
      await dissmissButton.click();
      expect(ondismiss).toHaveBeenCalled();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("chip");
}
