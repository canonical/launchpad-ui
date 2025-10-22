/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { ComboboxContext } from "../../types.js";
import Component from "./Loading.svelte";

const { loadingHidden, loadingShown } = vi.hoisted(() => {
  const loadingHidden = vi.fn();
  const loadingShown = vi.fn(() => loadingHidden);
  return { loadingHidden, loadingShown };
});

vi.mock("../../context.js", () => {
  return {
    getComboboxContext: (): Partial<ComboboxContext> => ({
      loadingShown,
    }),
  };
});

describe("Loading component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toHaveTextContent("Loading…");
  });

  it("renders children", async () => {
    const page = render(Component, {
      ...baseProps,
      children: createRawSnippet(() => ({
        render: () => "<span>Fetching data</span>",
      })),
    });
    await expect
      .element(componentLocator(page))
      .toHaveTextContent("Fetching data");
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
      await expect
        .element(componentLocator(page))
        .toHaveClass("combobox-loading");
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

  describe("Registers its presence in Combobox context", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("calls loadingShown when mounted", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(loadingShown).toHaveBeenCalledOnce();
    });

    it("calls loadingHidden when unmounted", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      page.unmount();
      await expect.element(componentLocator(page)).not.toBeInTheDocument();
      expect(loadingHidden).toHaveBeenCalledOnce();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("combobox-loading");
}
