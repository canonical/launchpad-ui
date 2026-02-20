import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
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

describe("PageSelect component", () => {
  const baseProps = {
    children,
    totalPages: 3,
    value: "2",
    "data-testid": "page-select",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentElement(page)).toBeVisible();
    await expect.element(selectLocator(page)).toBeVisible();
    await expect.element(page.getByText("of 3 Pages")).toBeVisible();
  });

  it("provides an accessible page label", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(page.getByLabelText("Page:")).toBeVisible();
  });

  describe("connects label and select", () => {
    it("when id is provided", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "page-select",
      });
      await expect
        .element(page.getByLabelText("Page:"))
        .toHaveAttribute("id", "page-select");
    });

    it("when id is omitted", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(page.getByLabelText("Page:")).toBeVisible();
    });
  });

  it("forwards pagination table id to aria-controls", async () => {
    const page = render(Component, { ...baseProps });
    await expect
      .element(selectLocator(page))
      .toHaveAttribute("aria-controls", tableId);
  });

  it("uses singular pagination text for one page", async () => {
    const page = render(Component, { ...baseProps, totalPages: 1 });
    await expect.element(page.getByText("of 1 Page")).toBeVisible();
  });

  it("applies classes", async () => {
    const page = render(Component, { ...baseProps, class: "test-class" });
    const element = componentElement(page);
    await expect.element(element).toHaveClass("test-class");
    await expect.element(element).toHaveClass("ds");
    await expect.element(element).toHaveClass("pagination-page-select");
  });

  it("applies style", async () => {
    const page = render(Component, {
      ...baseProps,
      style: "color: orange;",
    });
    await expect
      .element(componentElement(page))
      .toHaveStyle({ color: "orange" });
  });
});

function selectLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("combobox");
}

function componentElement(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("page-select");
}
