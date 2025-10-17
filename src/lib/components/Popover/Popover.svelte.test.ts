/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { assert, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Popover.svelte";
import type { PopoverMethods, PopoverTriggerProps } from "./types.js";

const trigger = createRawSnippet<[PopoverTriggerProps, boolean]>(
  (triggerProps, open) => ({
    render: () =>
      `<button popovertarget="${triggerProps().popovertarget}">${open() ? "Close Popover" : "Open Popover"}</button>`,
  }),
);

const children = createRawSnippet(() => ({
  render: () => `<div>This is content of the popover.</div>`,
}));

describe("Popover component", () => {
  const baseProps = {
    trigger,
    children,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(page.getByRole("button")).toBeInTheDocument();
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
      await expect.element(componentLocator(page)).toHaveClass("popover");
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

  describe("Declarative controls", () => {
    it("properly associates the trigger with the popover if no id is provided", async () => {
      const page = render(Component, { ...baseProps });
      const triggerButton = page.getByRole("button");
      await expect.element(triggerButton).toHaveAttribute("popovertarget");
      const popoverId = triggerButton.element().getAttribute("popovertarget");
      assert(popoverId !== null);
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("id", popoverId);
    });

    it("properly associates the trigger with the popover if an id is provided", async () => {
      const page = render(Component, { ...baseProps, id: "custom-id" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("popovertarget", "custom-id");
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("id", "custom-id");
    });

    it("clicking the trigger toggles the popover", async () => {
      const page = render(Component, { ...baseProps });
      const triggerButton = page.getByRole("button");
      await expect.element(componentLocator(page)).not.toBeVisible();
      await expect.element(triggerButton).toBeInTheDocument();
      await triggerButton.click();
      await expect.element(componentLocator(page)).toBeVisible();
      await triggerButton.click();
      await expect.element(componentLocator(page)).not.toBeVisible();
    });

    it("ontoggle is called on trigger click", async () => {
      const ontoggle = vi.fn();
      const page = render(Component, { ...baseProps, ontoggle });
      const triggerButton = page.getByRole("button");
      await triggerButton.click();
      expect(ontoggle).toHaveBeenCalledOnce();
      await triggerButton.click();
      expect(ontoggle).toHaveBeenCalledTimes(2);
    });

    it("onbeforetoggle is called on trigger click", async () => {
      const onbeforetoggle = vi.fn();
      const page = render(Component, { ...baseProps, onbeforetoggle });
      const triggerButton = page.getByRole("button");
      await triggerButton.click();
      expect(onbeforetoggle).toHaveBeenCalledOnce();
      await triggerButton.click();
      expect(onbeforetoggle).toHaveBeenCalledTimes(2);
    });
  });

  describe("Imperative controls", () => {
    it("showPopover shows the popover", async () => {
      const page = render(Component, { ...baseProps });
      const component = page.component as unknown as PopoverMethods;
      await expect.element(componentLocator(page)).not.toBeVisible();
      component.showPopover();
      await expect.element(componentLocator(page)).toBeVisible();
      // Calling showPopover again does nothing
      component.showPopover();
      await expect.element(componentLocator(page)).toBeVisible();
    });

    it("hidePopover hides the popover", async () => {
      const page = render(Component, { ...baseProps });
      const component = page.component as unknown as PopoverMethods;
      component.showPopover();
      await expect.element(componentLocator(page)).toBeVisible();
      component.hidePopover();
      await expect.element(componentLocator(page)).not.toBeVisible();
      // Calling hidePopover again does nothing
      component.hidePopover();
      await expect.element(componentLocator(page)).not.toBeVisible();
    });

    it("togglePopover toggles the popover", async () => {
      const page = render(Component, { ...baseProps });
      const component = page.component as unknown as PopoverMethods;
      await expect.element(componentLocator(page)).not.toBeVisible();
      component.togglePopover();
      await expect.element(componentLocator(page)).toBeVisible();
      component.togglePopover();
      await expect.element(componentLocator(page)).not.toBeVisible();
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Locators](https://vitest.dev/guide/browser/locators.html).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function componentLocator(page: RenderResult<any>): Locator {
  return page.getByTestId("popover");
}
