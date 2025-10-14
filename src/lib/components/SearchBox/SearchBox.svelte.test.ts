/* @canonical/generator-ds 0.10.0-experimental.4 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./SearchBox.svelte";

describe("SearchBox component", () => {
  const baseProps = {
    "aria-label": "Search articles",
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", async () => {
      expect(() => {
        render(Component, { ...baseProps });
      }).not.toThrow();
    });

    it("renders wrapper, input and button", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(wrapperLocator(page)).toBeInTheDocument();
      await expect.element(inputLocator(page)).toBeInTheDocument();
      await expect.element(buttonLocator(page)).toBeInTheDocument();
    });
  });

  describe("wrapper attributes", () => {
    it("applies classes to the wrapper", async () => {
      const page = render(Component, { class: "test-class", ...baseProps });
      await expect.element(wrapperLocator(page)).toHaveClass("test-class");
      await expect.element(wrapperLocator(page)).toHaveClass("ds");
      await expect.element(wrapperLocator(page)).toHaveClass("search-box");
    });
  });

  describe("input attributes", () => {
    it.each([
      ["name", "test-name"],
      ["placeholder", "test-placeholder"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, {
        ...baseProps,
        [attribute]: expected,
      });
      await expect
        .element(inputLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: orange;", ...baseProps });
      await expect.element(inputLocator(page)).toHaveStyle({ color: "orange" });
    });

    it("can be required", async () => {
      const page = render(Component, {
        ...baseProps,
        required: true,
      });
      await expect.element(inputLocator(page)).toBeRequired();
    });

    it("applies value", async () => {
      const page = render(Component, {
        ...baseProps,
        value: "test-value",
      });
      await expect.element(inputLocator(page)).toHaveValue("test-value");
    });
  });

  describe("button and input", () => {
    it("are not disabled by default", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(inputLocator(page)).toBeEnabled();
      await expect.element(buttonLocator(page)).toBeEnabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { ...baseProps, disabled: true });
      await expect.element(inputLocator(page)).toBeDisabled();
      await expect.element(buttonLocator(page)).toBeDisabled();
    });

    it("share the same accessible name", async () => {
      const label = "test-label";
      const page = render(Component, { ...baseProps, "aria-label": label });
      await expect
        .element(page.getByRole("searchbox", { name: label }))
        .toBeInTheDocument();
      await expect
        .element(page.getByRole("button", { name: label }))
        .toBeInTheDocument();
    });
  });
});

function wrapperLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("search-box");
}

function inputLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("searchbox", { name: "Search articles" });
}

function buttonLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button", { name: "Search articles" });
}
