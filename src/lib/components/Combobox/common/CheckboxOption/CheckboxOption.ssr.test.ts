/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { ComboboxContext } from "../../types.js";
import Component from "./CheckboxOption.svelte";

vi.mock("../../context.js", () => {
  return {
    getComboboxContext: (): Partial<ComboboxContext> => ({
      activeDescendant: "active-descendant-id",
      inputsName: "test-checkbox-group",
    }),
  };
});

describe("CheckboxOption SSR", () => {
  const baseProps = {
    text: "Option 1",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLLabelElement);
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
      expect(componentLocator(page).classList).toContain("combobox-option");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply role", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).hasAttribute("role")).toBe(false);
    });

    it("doesn't apply aria-selected", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).hasAttribute("aria-selected")).toBe(false);
    });
  });

  describe("Checkbox state", () => {
    it("isn't checked by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(checkboxLocator(page).checked).toBe(false);
    });

    it("can be checked", () => {
      const page = render(Component, {
        props: { ...baseProps, checked: true },
      });
      expect(checkboxLocator(page).checked).toBe(true);
    });

    it("doesn't apply inert", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(checkboxLocator(page).hasAttribute("inert")).toBe(false);
    });
  });

  describe("Context", () => {
    it("applies name from context", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(checkboxLocator(page).getAttribute("name")).toBe(
        "test-checkbox-group",
      );
    });

    it("has active class when activeDescendant matches id", () => {
      const page = render(Component, {
        props: { ...baseProps, id: "active-descendant-id" },
      });
      expect(componentLocator(page).classList).toContain("active");
    });

    it("doesn't have active class when activeDescendant doesn't match id", () => {
      const page = render(Component, {
        props: { ...baseProps, id: "other-id" },
      });
      expect(componentLocator(page).classList).not.toContain("active");
    });
  });
});

function componentLocator(page: RenderResult): HTMLLabelElement {
  return page.getByTestId("checkbox-option");
}

function checkboxLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("checkbox");
}
