import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Component from "./ItemsPerPageSelect.svelte";
import { children } from "./test.fixtures.svelte";

const { tableId } = vi.hoisted(() => ({
  tableId: "jobs-table",
}));

vi.mock("../../context.js", () => {
  return {
    getPaginationContext: () => ({ tableId }),
  };
});

describe("ItemsPerPageSelect SSR", () => {
  const baseProps = {
    children,
    value: "10",
    "data-testid": "items-per-page-select",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders label and select", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLDivElement);
    expect(page.getByText("Items per page:")).toBeInstanceOf(
      page.window.HTMLLabelElement,
    );
    expect(selectLocator(page)).toBeInstanceOf(page.window.HTMLSelectElement);
  });

  describe("connects label and select", () => {
    it("when id is provided", () => {
      const page = render(Component, {
        props: { ...baseProps, id: "items-per-page" },
      });
      expect(page.getByLabelText("Items per page:").id).toBe("items-per-page");
    });

    it("when id is omitted", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.getByLabelText("Items per page:").id).toBeTruthy();
    });
  });

  it("forwards pagination table id to aria-controls", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(selectLocator(page).getAttribute("aria-controls")).toBe(tableId);
  });

  it("applies classes", () => {
    const page = render(Component, {
      props: { class: "test-class", ...baseProps },
    });
    expect(componentLocator(page).classList).toContain("test-class");
    expect(componentLocator(page).classList).toContain("ds");
    expect(componentLocator(page).classList).toContain(
      "pagination-items-per-page-select",
    );
  });

  it("applies style", () => {
    const page = render(Component, {
      props: { style: "color: orange;", ...baseProps },
    });
    expect(componentLocator(page).style.color).toBe("orange");
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("items-per-page-select");
}

function selectLocator(page: RenderResult): HTMLSelectElement {
  return page.getByRole("combobox");
}
