/* @canonical/generator-ds 0.10.0-experimental.2 */

import { userEvent } from "@vitest/browser/context";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
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
  it("renders", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("combobox")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", label: "Search" });
      await expect
        .element(page.getByRole("combobox"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class", label: "Search" });
      await expect
        .element(page.getByRole("combobox"))
        .toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: blue;",
        label: "Search",
      });
      await expect
        .element(page.getByRole("combobox"))
        .toHaveStyle("color: blue;");
    });
  });

  describe("Keyboard interaction", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("calls getSiblingOptionId on arrow up and down", async () => {
      const page = render(Component, { label: "Search" });
      const input = page.getByRole("combobox");
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
      const page = render(Component, { label: "Search" });
      const input = page.getByRole("combobox");
      await expect.element(input).toBeInTheDocument();
      await userEvent.click(input);
      await userEvent.keyboard("{ArrowDown}");
      expect(setActiveDescendant).toHaveBeenCalledExactlyOnceWith(
        "sibling-option-id",
      );

      await userEvent.keyboard("{ArrowUp}");
      expect(setActiveDescendant).toHaveBeenCalledTimes(2);
      expect(setActiveDescendant).toHaveBeenLastCalledWith("sibling-option-id");
    });

    it("calls selectOption on enter", async () => {
      const page = render(Component, { label: "Search" });
      const input = page.getByRole("combobox");
      await expect.element(input).toBeInTheDocument();
      await userEvent.click(input);
      await userEvent.keyboard("{Enter}");
      expect(selectOption).toHaveBeenCalledExactlyOnceWith(
        "active-descendant-id",
      );
    });
  });

  it("calls setActiveDescendant with null on blur", async () => {
    const page = render(Component, { label: "Search" });
    const input = page.getByRole("combobox");
    await expect.element(input).toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.tab();
    expect(setActiveDescendant).toHaveBeenCalledWith(null);
  });
});
