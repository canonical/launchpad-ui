/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
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
  const baseProps = {
    text: "Option 1",
  } satisfies ComponentProps<typeof Component>;

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
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect
        .element(componentLocator(page))
        .toHaveClass("combobox-option");
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

  describe("After-mount attributes", () => {
    it("applies inert", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(checkboxLocator(page)).toHaveAttribute("inert");
    });
  });

  describe("Active descendant", () => {
    it("has active class when active", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "active-descendant-id",
      });
      await expect.element(componentLocator(page)).toHaveClass("active");
    });

    it("doesn't have active class when not active", async () => {
      const page = render(Component, { ...baseProps, id: "other-id" });
      await expect.element(componentLocator(page)).not.toHaveClass("active");
    });
  });

  describe("aria-selected", () => {
    it('applies aria-selected="true" when checked', async () => {
      const page = render(Component, {
        ...baseProps,
        checked: true,
      });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("aria-selected", "true");
    });

    it('applies aria-selected="false" when not checked', async () => {
      const page = render(Component, {
        ...baseProps,
        checked: false,
      });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("aria-selected", "false");
    });
  });

  describe("Reaction to external selection", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("listens for selection when mounted and unregisters when unmounted", async () => {
      const page = render(Component, { ...baseProps, id: "option-1" });
      await expect.element(componentLocator(page)).toBeInTheDocument();
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
        ...baseProps,
        onchange,
        oninput,
      });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(onchange).not.toHaveBeenCalled();
      expect(oninput).not.toHaveBeenCalled();
      notifyListeners();
      expect(onchange).toHaveBeenCalledOnce();
      expect(oninput).toHaveBeenCalledOnce();
    });

    it("changes checked state when notified of selection", async () => {
      const page = render(Component, { ...baseProps, checked: false });
      const checkbox = checkboxLocator(page);
      await expect.element(checkbox).not.toBeChecked();
      notifyListeners();
      await expect.element(checkbox).toBeChecked();
    });
  });

  it("applies context name to input", async () => {
    const page = render(Component, {
      ...baseProps,
    });
    await expect
      .element(checkboxLocator(page))
      .toHaveAttribute("name", "test-checkbox-group");
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("option");
}

function checkboxLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("checkbox");
}
