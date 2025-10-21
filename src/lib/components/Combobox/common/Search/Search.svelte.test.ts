/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { userEvent } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { ComboboxContext } from "../../types.js";
import Component from "./Search.svelte";

const {
  listBoxElement,
  setActiveDescendant,
  selectOption,
  getSiblingOptionId,
} = vi.hoisted(() => {
  const listBoxElement = document.createElement("div");
  const setActiveDescendant = vi.fn();
  const selectOption = vi.fn();
  const getSiblingOptionId = vi.fn(() => "sibling-option-id");
  return {
    listBoxElement,
    setActiveDescendant,
    selectOption,
    getSiblingOptionId,
  };
});

vi.mock("../../context.js", () => {
  return {
    getComboboxContext: (): Partial<ComboboxContext> => ({
      get activeDescendant() {
        return "active-descendant-id";
      },
      set activeDescendant(id: string | null) {
        setActiveDescendant(id);
      },
      listBoxElement,
      selectOption,
    }),
  };
});

vi.mock("./utils/getSiblingOptionId.js", () => {
  return {
    getSiblingOptionId,
  };
});

describe("Search component", () => {
  const baseProps = {
    "aria-label": "Search",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
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
      await expect
        .element(page.getByTestId("search-box"))
        .toHaveClass("test-class");
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

  describe("Keyboard interaction", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("calls getSiblingOptionId on arrow up and down", async () => {
      const page = render(Component, { ...baseProps });
      const input = componentLocator(page);
      await expect.element(input).toBeInTheDocument();
      await userEvent.click(input);
      await userEvent.keyboard("{ArrowDown}");
      expect(getSiblingOptionId).toHaveBeenCalledExactlyOnceWith(
        listBoxElement,
        "active-descendant-id",
        "next",
      );

      await userEvent.keyboard("{ArrowUp}");
      expect(getSiblingOptionId).toHaveBeenCalledTimes(2);
      expect(getSiblingOptionId).toHaveBeenLastCalledWith(
        listBoxElement,
        "active-descendant-id",
        "previous",
      );
    });

    it("calls setActiveDescendant on arrow up and down", async () => {
      const page = render(Component, { ...baseProps });
      const input = componentLocator(page);
      await expect.element(input).toBeInTheDocument();
      (input.element() as HTMLElement).focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(setActiveDescendant).toHaveBeenCalledExactlyOnceWith(
        "sibling-option-id",
      );

      await userEvent.keyboard("{ArrowUp}");
      expect(setActiveDescendant).toHaveBeenCalledTimes(2);
      expect(setActiveDescendant).toHaveBeenLastCalledWith("sibling-option-id");
    });

    it("calls selectOption on enter", async () => {
      const page = render(Component, { ...baseProps });
      const input = componentLocator(page);
      await expect.element(input).toBeInTheDocument();
      await userEvent.click(input);
      await userEvent.keyboard("{Enter}");
      expect(selectOption).toHaveBeenCalledExactlyOnceWith(
        "active-descendant-id",
      );
    });
  });

  it("calls setActiveDescendant with null on blur", async () => {
    const page = render(Component, { ...baseProps });
    const input = componentLocator(page);
    await expect.element(input).toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.tab();
    expect(setActiveDescendant).toHaveBeenCalledWith(null);
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("combobox");
}
