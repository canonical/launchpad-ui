/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { ComboboxContext } from "../../types.js";
import Component from "./Search.svelte";

const {
  listBoxElement,
  setActiveDescendant,
  selectOption,
  getSiblingOptionId,
  contextState,
} = vi.hoisted(() => {
  const listBoxElement = document.createElement("div");
  const setActiveDescendant = vi.fn();
  const selectOption = vi.fn();
  const getSiblingOptionId = vi.fn(() => "sibling-option-id");
  const contextState = {
    activeDescendant: "active-descendant-id" as string | null,
  };
  return {
    listBoxElement,
    setActiveDescendant,
    selectOption,
    getSiblingOptionId,
    contextState,
  };
});

vi.mock("../../context.js", () => {
  return {
    getComboboxContext: (): Partial<ComboboxContext> => ({
      get activeDescendant() {
        return contextState.activeDescendant;
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
    "data-testid": "search-box",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = await render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("attributes", () => {
    it.each([["id", "test-id"]])("applies %s", async (attribute, expected) => {
      const page = await render(Component, {
        ...baseProps,
        [attribute]: expected,
      });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = await render(Component, {
        ...baseProps,
        class: "test-class",
      });
      await expect
        .element(page.getByTestId("search-box"))
        .toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = await render(Component, {
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
      contextState.activeDescendant = "active-descendant-id";
    });

    it("calls getSiblingOptionId on arrow up and down", async () => {
      const page = await render(Component, { ...baseProps });
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
      const page = await render(Component, { ...baseProps });
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
      const page = await render(Component, { ...baseProps });
      const input = componentLocator(page);
      await expect.element(input).toBeInTheDocument();
      await userEvent.click(input);
      await userEvent.keyboard("{Enter}");
      expect(selectOption).toHaveBeenCalledExactlyOnceWith(
        "active-descendant-id",
      );
    });

    it("calls onkeydown before handling keys", async () => {
      const onkeydown = vi.fn();
      const page = await render(Component, { ...baseProps, onkeydown });
      await userEvent.click(componentLocator(page));

      await userEvent.keyboard("{ArrowDown}{ArrowUp}{Enter}");
      expect(onkeydown.mock.calls.map(([event]) => event.key)).toEqual([
        "ArrowDown",
        "ArrowUp",
        "Enter",
      ]);
      expect(onkeydown.mock.invocationCallOrder[0]).toBeLessThan(
        getSiblingOptionId.mock.invocationCallOrder[0],
      );
      expect(onkeydown.mock.invocationCallOrder[2]).toBeLessThan(
        selectOption.mock.invocationCallOrder[0],
      );

      onkeydown.mockClear();
      await userEvent.keyboard("a");
      expect(onkeydown).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ key: "a" }),
      );
    });

    it.each(["ArrowDown", "ArrowUp", "Enter", "Escape"])(
      "allows onkeydown to cancel %s",
      async (key) => {
        const onkeydownUnhandled = vi.fn();
        const onkeydown = vi.fn((event: KeyboardEvent) =>
          event.preventDefault(),
        );
        const page = await render(Component, {
          ...baseProps,
          onkeydown,
          onkeydownUnhandled,
        });
        await userEvent.click(componentLocator(page));
        setActiveDescendant.mockClear();
        await userEvent.keyboard(`{${key}}`);

        expect(onkeydown).toHaveBeenCalled();
        expect(getSiblingOptionId).not.toHaveBeenCalled();
        expect(setActiveDescendant).not.toHaveBeenCalled();
        expect(selectOption).not.toHaveBeenCalled();
        expect(onkeydownUnhandled).not.toHaveBeenCalled();
      },
    );

    it.each(["ArrowDown", "ArrowUp", "Enter", "Escape"])(
      "does not call onkeydownUnhandled for handled %s",
      async (key) => {
        const onkeydownUnhandled = vi.fn();
        const page = await render(Component, {
          ...baseProps,
          onkeydownUnhandled,
        });
        await userEvent.click(componentLocator(page));
        await userEvent.keyboard(`{${key}}`);

        expect(onkeydownUnhandled).not.toHaveBeenCalled();
      },
    );

    it.each(["a", "Enter", "Escape"])(
      "calls onkeydownUnhandled after onkeydown for unhandled %s",
      async (key) => {
        contextState.activeDescendant = null;
        const onkeydown = vi.fn();
        const onkeydownUnhandled = vi.fn();
        const page = await render(Component, {
          ...baseProps,
          onkeydown,
          onkeydownUnhandled,
        });
        await userEvent.click(componentLocator(page));
        await userEvent.keyboard(`{${key}}`);

        expect(selectOption).not.toHaveBeenCalled();
        expect(onkeydownUnhandled).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({ key, defaultPrevented: false }),
        );
        expect(onkeydown.mock.invocationCallOrder[0]).toBeLessThan(
          onkeydownUnhandled.mock.invocationCallOrder[0],
        );
      },
    );

    it("allows onkeydown to cancel an unhandled key", async () => {
      contextState.activeDescendant = null;
      const onkeydownUnhandled = vi.fn();
      const page = await render(Component, {
        ...baseProps,
        onkeydown: (event) => event.preventDefault(),
        onkeydownUnhandled,
      });
      await userEvent.click(componentLocator(page));
      await userEvent.keyboard("{Enter}");

      expect(onkeydownUnhandled).not.toHaveBeenCalled();
    });
  });

  it("calls setActiveDescendant with null on blur", async () => {
    const page = await render(Component, { ...baseProps });
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
