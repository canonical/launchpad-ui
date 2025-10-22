/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { assert, describe, expect, it } from "vitest";
import Component from "./SidePanel.svelte";
import {
  children,
  closeButtonText,
  contentText,
  trigger,
  triggerText,
} from "./test.fixtures.svelte";

describe("SidePanel SSR", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLDialogElement,
      );
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("side-panel");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("basics", () => {
    it("renders children", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          children,
        },
      });
      expect(page.getByText(contentText)).toBeDefined();
    });

    it("renders trigger", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          trigger,
        },
      });
      expect(triggerLocator(page)).toBeDefined();
    });
  });

  describe("Declarative controls", () => {
    it("properly links trigger with side panel", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          trigger,
        },
      });
      const sidePanelId = componentLocator(page).getAttribute("id");
      assert(sidePanelId !== undefined);
      expect(triggerLocator(page).getAttribute("popovertarget")).toBe(
        sidePanelId,
      );
      expect(triggerLocator(page).getAttribute("aria-haspopup")).toBe("dialog");
    });

    it("properly links children controls with side panel", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          children,
        },
      });
      const sidePanelId = componentLocator(page).getAttribute("id");
      assert(sidePanelId !== undefined);
      const closeButton = page.getByRole("button", {
        name: closeButtonText,
        hidden: true,
      });
      expect(closeButton.getAttribute("popovertarget")).toBe(sidePanelId);
    });
  });

  describe("Popover fallback", () => {
    it("renders as auto popover if `closeOnOutsideClick` is true", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          closeOnOutsideClick: true,
        },
      });
      expect(componentLocator(page).getAttribute("popover")).toBe("auto");
    });

    it("renders as manual popover if `closeOnOutsideClick` is false", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          closeOnOutsideClick: false,
        },
      });
      expect(componentLocator(page).getAttribute("popover")).toBe("manual");
    });

    it("does not have `closedby` attribute", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).getAttribute("closedby")).toBeNull();
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("dialog", { hidden: true });
}

function triggerLocator(page: RenderResult): HTMLElement {
  return page.getByRole("button", { name: triggerText });
}
