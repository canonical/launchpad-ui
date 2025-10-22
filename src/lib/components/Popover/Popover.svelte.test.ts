/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { assert, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Popover.svelte";
import {
  children,
  childrenText,
  trigger,
  triggerCloseText,
  triggerOpenText,
} from "./test.fixtures.svelte";
import type { PopoverMethods } from "./types.js";

describe("Popover component", () => {
  const baseProps = {
    trigger,
    children,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(triggerLocator(page)).toBeInTheDocument();
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  it("renders content", async () => {
    const page = render(Component, { ...baseProps });
    await expect
      .element(componentLocator(page))
      .toHaveTextContent(childrenText);
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
      const popoverId = triggerLocator(page)
        .element()
        .getAttribute("popovertarget");
      assert(popoverId !== null);
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("id", popoverId);
    });

    it("properly associates the trigger with the popover if an id is provided", async () => {
      const page = render(Component, { ...baseProps, id: "custom-id" });
      await expect
        .element(triggerLocator(page))
        .toHaveAttribute("popovertarget", "custom-id");
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("id", "custom-id");
    });

    it("clicking the trigger toggles the popover", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(componentLocator(page)).not.toBeVisible();
      await triggerLocator(page).click();
      await expect.element(componentLocator(page)).toBeVisible();
      await expect
        .element(page.getByRole("button", { name: triggerCloseText }))
        .toBeInTheDocument();
      await triggerLocator(page, true).click();
      await expect.element(componentLocator(page)).not.toBeVisible();
    });

    it("ontoggle is called on trigger click", async () => {
      const ontoggle = vi.fn();
      const page = render(Component, { ...baseProps, ontoggle });
      await triggerLocator(page).click();
      expect(ontoggle).toHaveBeenCalledOnce();
      await triggerLocator(page, true).click();
      expect(ontoggle).toHaveBeenCalledTimes(2);
    });

    it("onbeforetoggle is called on trigger click", async () => {
      const onbeforetoggle = vi.fn();
      const page = render(Component, { ...baseProps, onbeforetoggle });
      await triggerLocator(page).click();
      expect(onbeforetoggle).toHaveBeenCalledOnce();
      await triggerLocator(page, true).click();
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

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("popover");
}

function triggerLocator(
  page: RenderResult<typeof Component>,
  open: boolean = false,
): Locator {
  return page.getByRole("button", {
    name: open ? triggerCloseText : triggerOpenText,
  });
}
