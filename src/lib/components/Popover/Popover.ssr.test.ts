/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { assert, describe, expect, it } from "vitest";
import Component from "./Popover.svelte";
import {
  children,
  childrenText,
  trigger,
  triggerOpenText,
} from "./test.fixtures.svelte";

describe("Popover SSR", () => {
  const baseProps = {
    trigger,
    children,
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeTruthy();
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
      expect(componentLocator(page).classList).toContain("popover");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  it("renders trigger", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(triggerLocator(page)).toBeTruthy();
  });

  it("renders content", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page).textContent).toContain(childrenText);
  });

  it("properly links trigger with content", () => {
    const page = render(Component, { props: { ...baseProps } });
    const popoverId = componentLocator(page).getAttribute("id");
    assert(popoverId !== null);
    expect(triggerLocator(page).getAttribute("popovertarget")).toBe(popoverId);
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("popover");
}

function triggerLocator(page: RenderResult): HTMLButtonElement {
  return page.getByRole("button", {
    name: triggerOpenText,
  });
}
