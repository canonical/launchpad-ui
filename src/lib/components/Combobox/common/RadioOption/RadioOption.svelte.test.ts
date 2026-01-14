/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { ComboboxContext } from "../../types.js";
import Component from "./RadioOption.svelte";

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

const {
  notifyRadioChecked,
  listenForRadioCheck,
  unregisterRadioCheckListener,
} = vi.hoisted(() => {
  const unregisterRadioCheckListener = vi.fn();
  const radioCheckListeners = new Set<(id: string) => void>();
  return {
    notifyRadioChecked: vi.fn((id: string) => {
      radioCheckListeners.forEach((listener) => listener(id));
    }),
    listenForRadioCheck: vi.fn((listener: (id: string) => void) => {
      radioCheckListeners.add(listener);
      return unregisterRadioCheckListener;
    }),
    unregisterRadioCheckListener,
  };
});

vi.mock("../../context.js", () => {
  return {
    getComboboxContext: (): Partial<ComboboxContext> => ({
      activeDescendant: "active-descendant-id",
      listenForOptionSelect,
      listenForRadioCheck,
      notifyRadioChecked,
      inputsName: "test-radio-group",
    }),
  };
});

describe("RadioOption component", () => {
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
      await expect.element(componentLocator(page)).toHaveClass("radio-option");
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
      await expect.element(radioLocator(page)).toHaveAttribute("inert");
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

    it("listens for radio check when mounted and unregisters when unmounted", async () => {
      const page = render(Component, { ...baseProps, id: "option-1" });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(listenForOptionSelect).toHaveBeenCalledExactlyOnceWith(
        "option-1",
        expect.any(Function),
      );
      page.unmount();
      expect(unregisterOptionSelectListener).toHaveBeenCalledOnce();
    });

    it("dispatches change/input events when not checked and notified of selection", async () => {
      const onchange = vi.fn();
      const oninput = vi.fn();
      const page = render(Component, {
        ...baseProps,
        id: "option-1",
        onchange,
        oninput,
      });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(onchange).not.toHaveBeenCalled();
      expect(oninput).not.toHaveBeenCalled();
      notifyListeners();
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(onchange).toHaveBeenCalledOnce();
      expect(oninput).toHaveBeenCalledOnce();
    });

    it("doesn't dispatch change/input events when already checked and notified of selection", async () => {
      const onchange = vi.fn();
      const oninput = vi.fn();
      const page = render(Component, {
        ...baseProps,
        id: "option-1",
        checked: true,
        onchange,
        oninput,
      });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(onchange).not.toHaveBeenCalled();
      expect(oninput).not.toHaveBeenCalled();
      notifyListeners();
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(onchange).not.toHaveBeenCalled();
      expect(oninput).not.toHaveBeenCalled();
    });

    it("gets checked when notified of selection", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "option-1",
        checked: false,
      });
      await expect.element(radioLocator(page)).not.toBeChecked();
      notifyListeners();
      await expect.element(radioLocator(page)).toBeChecked();
    });

    it("calls notifyRadioChecked when selected", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "option-1",
        checked: false,
      });
      expect(notifyRadioChecked).not.toHaveBeenCalled();
      await componentLocator(page).click();
      expect(notifyRadioChecked).toHaveBeenCalledExactlyOnceWith("option-1");
    });
  });

  it("applies context name to input", async () => {
    const page = render(Component, { ...baseProps, id: "option-1" });
    await expect
      .element(radioLocator(page))
      .toHaveAttribute("name", "test-radio-group");
  });

  describe("Reaction to radio check from other options", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("listens for radio check when mounted and unregisters when unmounted", async () => {
      const page = render(Component, { ...baseProps, id: "option-1" });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      expect(listenForRadioCheck).toHaveBeenCalledOnce();
      page.unmount();
      expect(unregisterRadioCheckListener).toHaveBeenCalledOnce();
    });

    it("aria-selected becomes false when another option is checked", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "option-1",
        checked: true,
      });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("aria-selected", "true");
      notifyRadioChecked("other-option-id");
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("aria-selected", "false");
    });

    it("doesn't change checked state when notified of its own check", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "option-1",
        checked: false,
      });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("aria-selected", "false");
      notifyRadioChecked("option-1");
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("aria-selected", "false");
    });

    it("calls notifyRadioChecked when clicked", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "option-1",
        checked: false,
      });
      expect(notifyRadioChecked).not.toHaveBeenCalled();
      await componentLocator(page).click();
      expect(notifyRadioChecked).toHaveBeenCalledExactlyOnceWith("option-1");
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("option");
}

function radioLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("radio");
}
