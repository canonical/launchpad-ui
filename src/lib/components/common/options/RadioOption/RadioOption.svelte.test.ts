/* @canonical/generator-ds 0.10.0-experimental.5 */

import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./RadioOption.svelte";

const baseProps = {
  text: "Option",
} satisfies ComponentProps<typeof Component>;

/**
 * Returns a locator for the RadioOption wrapper element.
 * Uses testId as the component doesn't have a single semantic role.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function componentLocator(page: RenderResult<any>): Locator {
  return page.getByTestId("radio-option");
}

describe("RadioOption component", () => {
  describe("Renders", () => {
    it("renders", async () => {
      const page = render(Component, baseProps);
      await expect.element(page.getByRole("radio")).toBeInTheDocument();
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
      await expect.element(element).toHaveClass("radio-option");
      await expect.element(element).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { ...baseProps, style: "color: orange;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle("color: orange;");
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", async () => {
      const page = render(Component, baseProps);
      await expect.element(page.getByRole("radio")).not.toBeChecked();
    });

    it("can be checked", async () => {
      const page = render(Component, { ...baseProps, checked: true });
      await expect.element(page.getByRole("radio")).toBeChecked();
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", async () => {
      const page = render(Component, baseProps);
      await expect.element(page.getByRole("radio")).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { ...baseProps, disabled: true });
      await expect.element(page.getByRole("radio")).toBeDisabled();
    });
  });

  describe("Label", () => {
    it("has label from text", async () => {
      const page = render(Component, { ...baseProps, text: "Basic" });
      await expect.element(page.getByLabelText("Basic")).toBeInTheDocument();
    });

    it("has label from secondary text", async () => {
      const page = render(Component, {
        ...baseProps,
        text: "Basic",
        secondaryText: "Secondary",
      });
      await expect
        .element(page.getByLabelText("Secondary"))
        .toBeInTheDocument();
    });

    it("has label from trailing text", async () => {
      const page = render(Component, {
        ...baseProps,
        text: "Basic",
        trailingText: "Trailing",
      });
      await expect.element(page.getByLabelText("Trailing")).toBeInTheDocument();
    });
  });
});
