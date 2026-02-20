import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Component from "./PageNavigation.svelte";

const { tableId } = vi.hoisted(() => ({
  tableId: "jobs-table",
}));

vi.mock("../../context.js", () => {
  return {
    getPaginationContext: () => ({ tableId }),
  };
});

describe("PageNavigation SSR", () => {
  const baseProps = {
    direction: "previous",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders a button", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(
      page.window.HTMLButtonElement,
    );
  });

  it.each([
    ["first", "Go to first page"],
    ["previous", "Go to previous page"],
    ["next", "Go to next page"],
    ["last", "Go to last page"],
  ] as const)("maps %s direction to aria label", (direction, expectedLabel) => {
    const page = render(Component, { props: { direction } });
    expect(componentLocator(page).getAttribute("aria-label")).toBe(
      expectedLabel,
    );
  });

  it("forwards pagination table id to aria-controls", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page).getAttribute("aria-controls")).toBe(tableId);
  });

  it("renders an icon for the selected direction", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page).querySelector("svg")).not.toBeNull();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "Custom page navigation"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { class: "test-class", ...baseProps },
      });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain(
        "pagination-page-navigation",
      );
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { style: "color: orange;", ...baseProps },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });

    it("supports disabled state", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      expect(componentLocator(page).disabled).toBe(true);
    });
  });
});

function componentLocator(page: RenderResult): HTMLButtonElement {
  return page.getByRole("button");
}
