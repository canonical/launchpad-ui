/* @canonical/generator-ds 0.10.0-experimental.4 */

import type { Locator } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./TextInputPrimitive.svelte";
import type { TextInputPrimitiveProps } from "./types.js";

describe("TextInputPrimitive component", () => {
  const baseProps = {} satisfies TextInputPrimitiveProps;

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

    describe("type", () => {
      it("defaults to text", async () => {
        const page = render(Component, { ...baseProps });
        await expect
          .element(componentLocator(page))
          .toHaveAttribute("type", "text");
      });

      it.each(["text", "password", "email", "url", "tel"] as const)(
        "accepts %s",
        async (type) => {
          const page = render(Component, { ...baseProps, type });
          await expect
            .element(componentLocator(page))
            .toHaveAttribute("type", type);
        },
      );
    });

    it("accepts search", async () => {
      const page = render(Component, { ...baseProps, type: "search" });
      await expect
        .element(page.getByRole("searchbox"))
        .toHaveAttribute("type", "search");
    });

    it("applies value", async () => {
      const page = render(Component, {
        ...baseProps,
        value: "Test value",
      });
      await expect.element(componentLocator(page)).toHaveValue("Test value");
    });

    describe("disabled", () => {
      it("isn't disabled by default", async () => {
        const page = render(Component, { ...baseProps });
        await expect.element(componentLocator(page)).not.toBeDisabled();
      });

      it("can be disabled", async () => {
        const page = render(Component, { ...baseProps, disabled: true });
        await expect.element(componentLocator(page)).toBeDisabled();
      });
    });

    it("applies validation attributes", async () => {
      const page = render(Component, {
        ...baseProps,
        required: true,
      });

      await expect.element(componentLocator(page)).toBeRequired();
      await expect.element(componentLocator(page)).toBeInvalid();

      await componentLocator(page).fill("123");
      await expect.element(componentLocator(page)).toBeValid();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("textbox");
}
