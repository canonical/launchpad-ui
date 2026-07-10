/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Toolbar.svelte";
import Fixture from "./test.fixtures.svelte";
import type { FixtureAction } from "./test.fixtures.svelte";

const textareaId = ":c1:";
vi.mock("../../context.js", () => {
  return {
    getMarkdownEditorContext: () => ({
      textareaId,
    }),
  };
});

vi.mock("$lib/shortcuts/index.js", async (importActual) => {
  const actual = await importActual<typeof import("$lib/shortcuts/index.js")>();
  const useShortcuts = () => () => [];
  return {
    ...actual,
    // Mock so we don't get errors about `useShortcuts` being called outside of a provider
    useShortcuts,
  };
});

describe("Markdown Editor > Toolbar component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, value) => {
      const page = render(Component, { ...baseProps, [attribute]: value });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, value);
    });

    it("applies style", async () => {
      const page = render(Component, { ...baseProps, style: "color: orange;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle("color: orange;");
    });

    it("applies class", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      await expect.element(element).toHaveClass("ds");
      await expect.element(element).toHaveClass("markdown-editor-toolbar");
      await expect.element(element).toHaveClass("test-class");
    });
  });

  it("applies aria-controls", async () => {
    const page = render(Component, baseProps);
    await expect
      .element(componentLocator(page))
      .toHaveAttribute("aria-controls", textareaId);
  });

  describe("focus management", () => {
    function actionEl(
      page: RenderResult<typeof Fixture>,
      id: string,
    ): HTMLButtonElement {
      return page.getByTestId(id).element() as HTMLButtonElement;
    }

    function activeElement(page: RenderResult<typeof Fixture>): Element | null {
      return actionEl(page, "a").ownerDocument.activeElement;
    }

    async function expectTabStop(
      page: RenderResult<typeof Fixture>,
      id: string,
    ): Promise<void> {
      await expect
        .element(page.getByTestId(id))
        .toHaveAttribute("tabindex", "0");
    }

    async function expectNotTabStop(
      page: RenderResult<typeof Fixture>,
      id: string,
    ): Promise<void> {
      await expect
        .element(page.getByTestId(id))
        .toHaveAttribute("tabindex", "-1");
    }

    function threeActions(): FixtureAction[] {
      return [
        { id: "a", label: "Action A", disabled: false },
        { id: "b", label: "Action B", disabled: false },
        { id: "c", label: "Action C", disabled: false },
      ];
    }

    it("makes the first enabled action the tab stop", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");
      await expectNotTabStop(page, "b");
      await expectNotTabStop(page, "c");
    });

    it("skips leading disabled actions when choosing the tab stop", async () => {
      const actions = $state<FixtureAction[]>([
        { id: "a", label: "Action A", disabled: true },
        { id: "b", label: "Action B", disabled: false },
        { id: "c", label: "Action C", disabled: false },
      ]);
      const page = render(Fixture, { actions });
      await expectNotTabStop(page, "a");
      await expectTabStop(page, "b");
    });

    it("makes a focused action the tab stop", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");

      actionEl(page, "b").focus();
      await expectTabStop(page, "b");
      await expectNotTabStop(page, "a");
    });

    it("moves focus with the arrow keys in DOM order, wrapping around", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");

      actionEl(page, "a").focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(activeElement(page)).toBe(actionEl(page, "b"));

      await userEvent.keyboard("{ArrowRight}");
      expect(activeElement(page)).toBe(actionEl(page, "c"));

      await userEvent.keyboard("{ArrowRight}");
      expect(activeElement(page)).toBe(actionEl(page, "a"));

      await userEvent.keyboard("{ArrowLeft}");
      expect(activeElement(page)).toBe(actionEl(page, "c"));
    });

    it("follows the live DOM order after the actions are reordered", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");

      // Make B the active tab stop, then reverse the order to C, B, A.
      actionEl(page, "b").focus();
      await expectTabStop(page, "b");
      actions.reverse();

      // B is still the tab stop (identity is preserved across the reorder).
      await expectTabStop(page, "b");

      actionEl(page, "b").focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(activeElement(page)).toBe(actionEl(page, "a"));

      actionEl(page, "b").focus();
      await userEvent.keyboard("{ArrowLeft}");
      expect(activeElement(page)).toBe(actionEl(page, "c"));
    });

    it("moves the tab stop off an action that is removed from the DOM", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");

      actionEl(page, "b").focus();
      await expectTabStop(page, "b");

      actions.splice(
        actions.findIndex((action) => action.id === "b"),
        1,
      );

      // The tab stop falls back to the first remaining enabled action.
      await expectTabStop(page, "a");
    });

    it("moves the tab stop off an action that becomes disabled", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");

      // A is the tab stop; disabling it should hand the tab stop to B.
      actions[0].disabled = true;

      await expectNotTabStop(page, "a");
      await expect.element(page.getByTestId("a")).toHaveAttribute("disabled");
      await expectTabStop(page, "b");
    });

    it("skips disabled actions during arrow navigation", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");

      actions[1].disabled = true;
      await expect.element(page.getByTestId("b")).toHaveAttribute("disabled");

      actionEl(page, "a").focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(activeElement(page)).toBe(actionEl(page, "c"));
    });

    it("keeps a single tab stop when new actions are added", async () => {
      const actions = $state<FixtureAction[]>(threeActions());
      const page = render(Fixture, { actions });
      await expectTabStop(page, "a");

      // Focus A so it is the tab stop, then insert a new action before it.
      actionEl(page, "a").focus();
      await expectTabStop(page, "a");
      actions.unshift({ id: "added-0", label: "Added", disabled: false });

      // The active action keeps the tab stop; the new one is not tabbable.
      await expectTabStop(page, "a");
      await expectNotTabStop(page, "added-0");

      // The new action still participates in arrow navigation.
      actionEl(page, "a").focus();
      await userEvent.keyboard("{ArrowLeft}");
      expect(activeElement(page)).toBe(actionEl(page, "added-0"));
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("toolbar");
}
