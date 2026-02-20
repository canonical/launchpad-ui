import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Component from "./PageSelect.svelte";
import { children } from "./test.fixtures.svelte";

const { tableId } = vi.hoisted(() => ({
  tableId: "jobs-table",
}));

vi.mock("../../context.js", () => {
  return {
    getPaginationContext: () => ({ tableId }),
  };
});

describe("PageSelect SSR", () => {
  const baseProps = {
    children,
    totalPages: 3,
    value: "2",
    "data-testid": "page-select",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders label, select, and page count", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLDivElement);
    expect(page.getByLabelText("Page:")).toBeInstanceOf(
      page.window.HTMLSelectElement,
    );
    expect(page.getByText("of 3 Pages")).toBeInstanceOf(
      page.window.HTMLSpanElement,
    );
  });

  describe("connects label and select", () => {
    it("when id is provided", () => {
      const page = render(Component, {
        props: { ...baseProps, id: "page-select" },
      });
      expect(page.getByLabelText("Page:").id).toBe("page-select");
    });

    it("when id is omitted", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.getByLabelText("Page:").id).toBeTruthy();
    });
  });

  it("renders singular pagination text for one page", () => {
    const page = render(Component, { props: { ...baseProps, totalPages: 1 } });
    expect(page.getByText("of 1 Page")).toBeInstanceOf(
      page.window.HTMLSpanElement,
    );
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
      "pagination-page-select",
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
  return page.getByTestId("page-select");
}

function selectLocator(page: RenderResult): HTMLSelectElement {
  return page.getByRole("combobox");
}
