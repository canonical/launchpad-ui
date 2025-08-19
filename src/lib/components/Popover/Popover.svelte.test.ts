/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { assert, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Popover.svelte";

const trigger = createRawSnippet<[string, boolean]>((popovertarget, open) => ({
  render: () =>
    `<button popovertarget="${popovertarget()}">${open() ? "Close Popover" : "Open Popover"}</button>`,
}));

const children = createRawSnippet(() => ({
  render: () => `<div>This is content of the popover.</div>`,
}));

describe("Popover component", () => {
  it("renders", async () => {
    const page = render(Component, { trigger, children });
    await expect.element(page.getByRole("button")).toBeInTheDocument();
    await expect.element(testIdLocator(page)).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", trigger, children });
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, {
        class: "test-class",
        trigger,
        children,
      });
      await expect.element(testIdLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: red;",
        trigger,
        children,
      });
      await expect.element(testIdLocator(page)).toHaveStyle("color: red;");
    });
  });

  describe("Declarative controls", () => {
    it("properly associates the trigger with the popover if no id is provided", async () => {
      const page = render(Component, { trigger, children });
      const triggerButton = page.getByRole("button");
      await expect.element(triggerButton).toHaveAttribute("popovertarget");
      const popoverId = triggerButton.element().getAttribute("popovertarget");
      assert(popoverId !== null);
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", popoverId);
    });

    it("properly associates the trigger with the popover if an id is provided", async () => {
      const page = render(Component, { id: "custom-id", trigger, children });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("popovertarget", "custom-id");
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "custom-id");
    });

    it("clicking the trigger toggles the popover", async () => {
      const page = render(Component, { trigger, children });
      const triggerButton = page.getByRole("button");
      await expect.element(testIdLocator(page)).not.toBeVisible();
      await expect.element(triggerButton).toBeInTheDocument();
      await triggerButton.click();
      await expect.element(testIdLocator(page)).toBeVisible();
      await triggerButton.click();
      await expect.element(testIdLocator(page)).not.toBeVisible();
    });

    it("ontoggle is called on trigger click", async () => {
      const ontoggle = vi.fn();
      const page = render(Component, { trigger, children, ontoggle });
      const triggerButton = page.getByRole("button");
      await triggerButton.click();
      expect(ontoggle).toHaveBeenCalledOnce();
      await triggerButton.click();
      expect(ontoggle).toHaveBeenCalledTimes(2);
    });

    it("onbeforetoggle is called on trigger click", async () => {
      const onbeforetoggle = vi.fn();
      const page = render(Component, { trigger, children, onbeforetoggle });
      const triggerButton = page.getByRole("button");
      await triggerButton.click();
      expect(onbeforetoggle).toHaveBeenCalledOnce();
      await triggerButton.click();
      expect(onbeforetoggle).toHaveBeenCalledTimes(2);
    });
  });

  // describe("Imperative controls", () => {
  // TODO: Is there a way to test component methods?
  // });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("popover");
}
