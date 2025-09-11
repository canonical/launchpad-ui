/* @canonical/generator-ds 0.10.0-experimental.2 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { ComboboxContext } from "../../types.js";
import Component from "./CheckboxOption.svelte";

const {
  notifyListeners,
  listenForOptionSelect,
  unregisterOptionSelectListener,
} = vi.hoisted(() => {
  const unregisterOptionSelectListener = vi.fn();
  const optionSelectionListeners = new Set<() => void>();
  return {
    notifyListeners: () => {
      optionSelectionListeners.forEach((listener) => listener());
    },
    listenForOptionSelect: vi.fn((id: string, listener: () => void) => {
      optionSelectionListeners.add(listener);
      return unregisterOptionSelectListener;
    }),
    unregisterOptionSelectListener,
  };
});

vi.mock("../../context.js", () => {
  return {
    getComboboxContext: (): Partial<ComboboxContext> => ({
      activeDescendant: "active-descendant-id",
      listenForOptionSelect,
      inputsName: "test-checkbox-group",
    }),
  };
});

describe("CheckboxOption component", () => {
  it("renders", async () => {
    const page = render(Component, { text: "Option 1" });
    await expect.element(page.getByRole("option")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { text: "Text", id: "test-id" });
      await expect
        .element(page.getByRole("option"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { text: "Text", class: "test-class" });
      await expect.element(page.getByRole("option")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { text: "Text", style: "color: red;" });
      await expect.element(page.getByRole("option")).toHaveStyle("color: red;");
    });
  });

  describe("After-mount attributes", () => {
    it("applies inert", async () => {
      const page = render(Component, { text: "Option 1" });
      await expect.element(page.getByRole("checkbox")).toHaveAttribute("inert");
    });
  });

  describe("Active descendant", () => {
    it("has active class when active", async () => {
      const page = render(Component, {
        text: "Option 1",
        id: "active-descendant-id",
      });
      await expect.element(page.getByRole("option")).toHaveClass("active");
    });

    it("doesn't have active class when not active", async () => {
      const page = render(Component, { text: "Option 1", id: "other-id" });
      await expect.element(page.getByRole("option")).not.toHaveClass("active");
    });
  });

  describe("aria-selected", () => {
    it('applies aria-selected="true" when checked', async () => {
      const page = render(Component, {
        text: "Option 1",
        checked: true,
      });
      await expect
        .element(page.getByRole("option"))
        .toHaveAttribute("aria-selected", "true");
    });

    it('applies aria-selected="false" when not checked', async () => {
      const page = render(Component, {
        text: "Option 1",
        checked: false,
      });
      await expect
        .element(page.getByRole("option"))
        .toHaveAttribute("aria-selected", "false");
    });
  });

  describe("Reaction to external selection", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("listens for selection when mounted and unregisters when unmounted", async () => {
      const page = render(Component, { text: "Option 1", id: "option-1" });
      await expect.element(page.getByRole("option")).toBeInTheDocument();
      expect(listenForOptionSelect).toHaveBeenCalledExactlyOnceWith(
        "option-1",
        expect.any(Function),
      );
      page.unmount();
      expect(unregisterOptionSelectListener).toHaveBeenCalledOnce();
    });

    it("dispatches change/input events when notified of selection", async () => {
      const onchange = vi.fn();
      const oninput = vi.fn();
      const page = render(Component, {
        text: "Option 1",
        onchange,
        oninput,
      });
      await expect.element(page.getByRole("option")).toBeInTheDocument();
      expect(onchange).not.toHaveBeenCalled();
      expect(oninput).not.toHaveBeenCalled();
      notifyListeners();
      expect(onchange).toHaveBeenCalledOnce();
      expect(oninput).toHaveBeenCalledOnce();
    });

    it("changes checked state when notified of selection", async () => {
      const page = render(Component, { text: "Option 1", checked: false });
      const checkbox = page.getByRole("checkbox");
      await expect.element(checkbox).not.toBeChecked();
      notifyListeners();
      await expect.element(checkbox).toBeChecked();
    });
  });

  it("applies context name to input", async () => {
    const page = render(Component, {
      text: "Option 1",
    });
    await expect
      .element(page.getByRole("checkbox"))
      .toHaveAttribute("name", "test-checkbox-group");
  });
});
