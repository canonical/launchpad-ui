/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import type { ComponentProps, Snippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./ButtonPrimitive.svelte";

describe("ButtonPrimitive component", () => {
  describe("anchor specific", () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>ButtonPrimitive</span>`,
    }));
    const baseProps = {
      as: "a" as const,
      children: children as Snippet,
    } satisfies ComponentProps<typeof Component>;

    it("renders", async () => {
      const page = render(Component, { ...baseProps });
      // get by role won't work because if `href` isn't provided, anchor elements don't have a `link` role
      await expect.element(page.getByText("ButtonPrimitive")).toBeVisible();
    });

    it("applies href", async () => {
      const page = render(Component, {
        ...baseProps,
        href: "https://canonical.com",
      });
      await expect
        .element(componentLocator(page, "a"))
        .toHaveAttribute("href", "https://canonical.com");
    });
  });

  describe("button specific", () => {
    const baseProps = {
      as: "button" as const,
    } satisfies ComponentProps<typeof Component>;

    it("renders", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(componentLocator(page, "button")).toBeVisible();
    });

    it("applies type", async () => {
      const page = render(Component, {
        ...baseProps,
        type: "submit",
      });
      await expect
        .element(componentLocator(page, "button"))
        .toHaveAttribute("type", "submit");
    });
  });

  describe.each(["button", "a"] as const)("as %s", (as) => {
    const baseProps = as === "a" ? { as, href: "#" } : { as };

    describe("attributes", () => {
      it.each([
        ["id", "test-id"],
        ["aria-label", "test-aria-label"],
      ])("applies %s", async (attribute, expected) => {
        const page = render(Component, {
          [attribute]: expected,
          ...baseProps,
        });
        await expect
          .element(componentLocator(page, as))
          .toHaveAttribute(attribute, expected);
      });

      it("applies classes", async () => {
        const page = render(Component, {
          class: "test-class",
          ...baseProps,
        });

        await expect
          .element(componentLocator(page, as))
          .toHaveClass("test-class");
      });

      it("applies style", async () => {
        const page = render(Component, {
          style: "color: orange;",
          ...baseProps,
        });
        await expect
          .element(componentLocator(page, as))
          .toHaveStyle({ color: "orange" });
      });

      it("can be disabled", async () => {
        const page = render(Component, {
          disabled: true,
          ...baseProps,
        });
        await expect.element(componentLocator(page, as)).toBeDisabled();
      });

      it("can be focused", async () => {
        const page = render(Component, {
          ...baseProps,
        });
        const element = componentLocator(page, as);
        await expect.element(element).toBeVisible();
        (element.element() as HTMLElement).focus();
        await expect.element(element).toHaveFocus();
      });

      it("calls onclick handler", async () => {
        const onclick = vi.fn();
        const page = render(Component, {
          onclick,
          ...baseProps,
        });
        const element = componentLocator(page, as);
        await expect.element(element).toBeVisible();
        await element.click();
        expect(onclick).toHaveBeenCalled();
      });
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Locators](https://vitest.dev/guide/browser/locators.html).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function componentLocator(
  page: RenderResult<any>,
  as: "button" | "a",
): Locator {
  const role = as === "a" ? "link" : "button";
  return page.getByRole(role);
}
