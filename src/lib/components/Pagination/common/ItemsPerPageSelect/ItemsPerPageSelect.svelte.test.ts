import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
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

describe("ItemsPerPageSelect component", () => {
  const baseProps = {
    children,
    value: "10",
    "data-testid": "items-per-page-select",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(selectLocator(page)).toBeVisible();
    await expect.element(page.getByText("Items per page:")).toBeVisible();
  });

  it("forwards pagination table id to aria-controls", async () => {
    const page = render(Component, { ...baseProps });
    await expect
      .element(selectLocator(page))
      .toHaveAttribute("aria-controls", tableId);
  });

  describe("connects label and select", () => {
    it("when id is provided", async () => {
      const page = render(Component, {
        ...baseProps,
        id: "items-per-page",
      });
      await expect
        .element(page.getByLabelText("Items per page:"))
        .toHaveAttribute("id", "items-per-page");
    });

    it("when id is omitted", async () => {
      const page = render(Component, { ...baseProps });
      await expect
        .element(page.getByLabelText("Items per page:"))
        .toBeVisible();
    });
  });

  it("applies classes", async () => {
    const page = render(Component, { ...baseProps, class: "test-class" });
    const element = componentLocator(page);
    await expect.element(element).toHaveClass("test-class");
    await expect.element(element).toHaveClass("ds");
    await expect
      .element(element)
      .toHaveClass("pagination-items-per-page-select");
  });

  it("applies style", async () => {
    const page = render(Component, {
      ...baseProps,
      style: "color: orange;",
    });
    await expect
      .element(componentLocator(page))
      .toHaveStyle({ color: "orange" });
  });
});

function selectLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByLabelText("Items per page:");
}

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("items-per-page-select");
}
