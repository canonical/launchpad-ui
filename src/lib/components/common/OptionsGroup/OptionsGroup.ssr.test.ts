/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./OptionsGroup.svelte";

describe("Group SSR", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  describe("renders", () => {
    it("the fieldset", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLFieldSetElement,
      );
    });

    it("no legend by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      const legend = page.container.querySelector("legend");
      expect(legend).toBeNull();
    });

    it("the legend with group title", () => {
      const page = render(Component, {
        props: { ...baseProps, groupTitle: "Group Title" },
      });

      const legend = page.container.querySelector("legend");
      expect(legend?.textContent).toContain("Group Title");
      expect(page.getByRole("group", { name: "Group Title" })).toBeTruthy();
    });
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      const element = componentLocator(page);
      expect(element.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList.contains("ds")).toBe(true);
      expect(element.classList.contains("options-group")).toBe(true);
      expect(element.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).getAttribute("style")).toBe(
        "color: orange;",
      );
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      const element = componentLocator(page);
      expect(element.hasAttribute("disabled")).toBe(false);
    });

    it("can be disabled", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      const element = componentLocator(page);
      expect(element.hasAttribute("disabled")).toBe(true);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("group");
}
