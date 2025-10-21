/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Tab.svelte";

describe("Tab component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeVisible();
  });

  describe("attributes", () => {
    it.each([["id", "test-id"]])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      await expect.element(componentLocator(page)).toHaveClass("test-class");
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect.element(componentLocator(page)).toHaveClass("tab");
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

  describe("base properties", () => {
    it("applies href", async () => {
      const page = render(Component, { ...baseProps, href: "/test" });
      const element = page.getByRole("link");
      await expect.element(element).toHaveAttribute("href", "/test");
    });

    it("applies aria-attributes", async () => {
      const page = render(Component, {
        ...baseProps,
        "aria-disabled": "true",
        href: "/test",
      });
      const element = page.getByRole("link");
      await expect.element(element).toHaveAttribute("aria-disabled", "true");
    });

    describe("active state", () => {
      it("is not active by default", async () => {
        const page = render(Component, { ...baseProps, href: "/test" });
        const listitem = page.getByRole("listitem");
        const link = page.getByRole("link");

        await expect.element(listitem).not.toHaveClass("active");
        await expect.element(link).not.toHaveAttribute("aria-current");
      });

      it("can be active", async () => {
        const page = render(Component, {
          ...baseProps,
          active: true,
          href: "/test",
        });

        const listitem = page.getByRole("listitem");
        const link = page.getByRole("link");

        await expect.element(listitem).toHaveClass("active");
        await expect.element(link).toHaveAttribute("aria-current", "page");
      });
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("listitem");
}
