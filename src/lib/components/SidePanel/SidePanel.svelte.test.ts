/* @canonical/generator-ds 0.10.0-experimental.5 */

import { userEvent } from "@vitest/browser/context";
import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./SidePanel.svelte";
import {
  children,
  closeButtonText,
  contentText,
  trigger,
  triggerText,
} from "./test.fixtures.svelte";
import type { SidePanelMethods } from "./types.js";

describe("SidePanel component", () => {
  const baseProps = {
    children,
    trigger,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page, true)).toBeInTheDocument();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(componentLocator(page, true))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      await expect
        .element(componentLocator(page, true))
        .toHaveClass("test-class");
      await expect.element(componentLocator(page, true)).toHaveClass("ds");
      await expect
        .element(componentLocator(page, true))
        .toHaveClass("side-panel");
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      await expect
        .element(componentLocator(page, true))
        .toHaveStyle({ color: "orange" });
    });
  });

  describe("basics", () => {
    it("renders trigger", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await expect.element(triggerLocator(page)).toBeInTheDocument();
      await expect
        .element(triggerLocator(page))
        .toHaveAttribute("aria-haspopup", "dialog");
    });

    it("renders children", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await expect
        .element(
          page.getByRole("button", {
            name: closeButtonText,
            includeHidden: true,
          }),
        )
        .toBeInTheDocument();
    });

    it("is hidden by default", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(componentLocator(page, true)).not.toBeVisible();

      await expect
        .element(componentLocator(page, true))
        .not.toHaveAttribute("open");
    });
  });

  describe("Opening the SidePanel", () => {
    it("is opened when `showModal` on the dialog element is called", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await expect.element(componentLocator(page, true)).not.toBeVisible();

      (componentLocator(page, true).element() as HTMLDialogElement).showModal();
      await expect.element(componentLocator(page)).toBeVisible();
      await expect.element(componentLocator(page)).toHaveAttribute("open");
      await expect.element(page.getByText(contentText)).toBeVisible();
    });

    it("is opened by trigger click", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await expect.element(componentLocator(page, true)).not.toBeVisible();
      await expect
        .element(componentLocator(page, true))
        .not.toHaveAttribute("popover");

      await triggerLocator(page).click();
      await expect.element(componentLocator(page)).toBeVisible();
      await expect.element(componentLocator(page)).toHaveAttribute("open");
      await expect.element(page.getByText(contentText)).toBeVisible();
    });

    it("is opened by showModal() on the component instance", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await expect.element(componentLocator(page, true)).not.toBeVisible();

      const component = page.component as unknown as SidePanelMethods;
      component.showModal();
      await expect.element(componentLocator(page)).toBeVisible();
      await expect.element(componentLocator(page)).toHaveAttribute("open");
      await expect.element(page.getByText(contentText)).toBeVisible();
    });
  });

  describe("Closing the SidePanel", () => {
    it("is closed when `close` on the dialog element is called", async () => {
      const page = render(Component, { ...baseProps });
      await showSidePanel(page);

      (componentLocator(page).element() as HTMLDialogElement).close();
      await expect.element(componentLocator(page, true)).not.toBeVisible();
      await expect
        .element(componentLocator(page, true))
        .not.toHaveAttribute("open");
    });

    it("is closed by close() supplied via children snippet", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await showSidePanel(page);

      await page.getByRole("button", { name: closeButtonText }).click();
      await expect.element(componentLocator(page, true)).not.toBeVisible();
      await expect
        .element(componentLocator(page, true))
        .not.toHaveAttribute("open");
    });

    it("is closed by close() on the component instance", async () => {
      const page = render(Component, { ...baseProps });
      await showSidePanel(page);

      const component = page.component as unknown as SidePanelMethods;
      component.close();
      await expect.element(componentLocator(page, true)).not.toBeVisible();
      await expect
        .element(componentLocator(page, true))
        .not.toHaveAttribute("open");
    });

    // Webkit doesn't support `closedby` attribute on dialog elements (https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy), as such the side panels currently cannot be closed by clicking outside of them.
    // FIXME: Provide a fallback mechanism for Webkit browsers.
    it.runIf(!navigator.userAgent.includes("Macintosh"))(
      "is closed by clicking outside the side panel when `closeOnOutsideClick` is true",
      async () => {
        const page = render(Component, {
          ...baseProps,
          closeOnOutsideClick: true,
        });
        await showSidePanel(page);

        await componentLocator(page).click({ position: { x: -10, y: 0 } });
        await expect.element(componentLocator(page, true)).not.toBeVisible();
        await expect
          .element(componentLocator(page, true))
          .not.toHaveAttribute("open");
      },
    );

    it("is not closed by clicking outside the side panel when `closeOnOutsideClick` is false", async () => {
      const page = render(Component, {
        ...baseProps,
        closeOnOutsideClick: false,
      });
      await showSidePanel(page);

      await componentLocator(page).click({ position: { x: 0, y: -10 } });
      await expect.element(componentLocator(page)).toBeVisible();
      await expect.element(componentLocator(page)).toHaveAttribute("open");
    });

    it("is closed by pressing Escape", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await showSidePanel(page);

      await userEvent.keyboard("{Escape}");
      await expect.element(componentLocator(page, true)).not.toBeVisible();
      await expect
        .element(componentLocator(page, true))
        .not.toHaveAttribute("open");
    });
  });

  describe("Removal of the fallback when mounted", () => {
    it("does not have popover attribute", async () => {
      const page = render(Component, { ...baseProps });
      await expect
        .element(componentLocator(page, true))
        .not.toHaveAttribute("popover");
    });

    it("popovertarget passed to trigger is undefined", async () => {
      const page = render(Component, { trigger });
      await expect
        .element(triggerLocator(page))
        .not.toHaveAttribute("popovertarget");
    });

    it("popovertarget passed to children is undefined", async () => {
      const page = render(Component, {
        ...baseProps,
      });
      await expect
        .element(
          page.getByRole("button", {
            name: closeButtonText,
            includeHidden: true,
          }),
        )
        .not.toHaveAttribute("popovertarget");
    });
  });
});

function componentLocator(
  page: RenderResult<typeof Component>,
  includeHidden = false,
): Locator {
  return page.getByRole("dialog", { includeHidden });
}

function triggerLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button", { name: triggerText });
}

async function showSidePanel(
  page: RenderResult<typeof Component>,
): Promise<void> {
  await expect
    .element(componentLocator(page, true))
    .not.toHaveAttribute("popover");
  (page.component as unknown as SidePanelMethods).showModal();
  await expect.element(componentLocator(page)).toBeVisible();
  await expect.element(componentLocator(page)).toHaveAttribute("open");
}
