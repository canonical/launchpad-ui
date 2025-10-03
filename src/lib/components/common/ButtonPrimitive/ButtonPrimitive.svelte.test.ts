/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./ButtonPrimitive.svelte";

describe("ButtonPrimitive component", () => {
  describe("anchor specific", () => {
    it("renders", async () => {
      const page = render(Component, {
        as: "a",
        children: createRawSnippet(() => ({
          render: () => `<span>ButtonPrimitive</span>`,
        })),
      });
      // get by role won't work because if `href` isn't provided, anchor elements don't have a `link` role
      await expect.element(page.getByText("ButtonPrimitive")).toBeVisible();
    });

    it("applies href", async () => {
      const page = render(Component, {
        as: "a",
        href: "https://canonical.com",
      });
      await expect
        .element(elementLocator(page, "a"))
        .toHaveAttribute("href", "https://canonical.com");
    });
  });

  describe("button specific", () => {
    it("renders", async () => {
      const page = render(Component, {
        as: "button",
      });
      await expect.element(elementLocator(page, "button")).toBeVisible();
    });

    it("applies type", async () => {
      const page = render(Component, {
        as: "button",
        type: "submit",
      });
      await expect
        .element(elementLocator(page, "button"))
        .toHaveAttribute("type", "submit");
    });
  });

  describe.each(["button", "a"] as const)("as %s", (as) => {
    const baseProps = as === "a" ? { as, href: "#" } : { as };

    describe("Basic attributes", () => {
      it.each([
        ["id", "test-id"],
        ["style", "color: orange;"],
        ["aria-label", "test-aria-label"],
      ])("applies %s", async (attribute, expected) => {
        const page = render(Component, {
          [attribute]: expected,
          ...baseProps,
        });
        await expect
          .element(elementLocator(page, as))
          .toHaveAttribute(attribute, expected);
      });

      it("applies classes", async () => {
        const page = render(Component, {
          class: "test-class",
          ...baseProps,
        });

        await expect
          .element(elementLocator(page, as))
          .toHaveClass("test-class");
      });

      it("can be disabled", async () => {
        const page = render(Component, {
          disabled: true,
          ...baseProps,
        });
        await expect.element(elementLocator(page, as)).toBeDisabled();
      });

      it("can be focused", async () => {
        const page = render(Component, {
          ...baseProps,
        });
        const element = elementLocator(page, as);
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
        const element = elementLocator(page, as);
        await expect.element(element).toBeVisible();
        await element.click();
        expect(onclick).toHaveBeenCalled();
      });
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function elementLocator(page: RenderResult<any>, as: "button" | "a") {
  const role = as === "a" ? "link" : "button";
  return page.getByRole(role);
}
