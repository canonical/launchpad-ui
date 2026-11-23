import { describe, expect, it } from "vitest";
import type { Locator, LocatorSelectors } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Component from "./FilterSummary.svelte";
import {
  actions,
  activeFilters,
  children,
  config,
  emptyFilters,
  testId,
} from "./test.fixtures.svelte";

const baseProps = { config, "data-testid": testId };

describe("FilterSummary", () => {
  it("renders nothing when no parts are visible", async () => {
    const page = await render(Component, {
      ...baseProps,
      filters: emptyFilters,
    });

    await expect.element(componentLocator(page)).not.toBeInTheDocument();
  });

  it("renders the default group as one flat list", async () => {
    const page = await render(Component, {
      ...baseProps,
      filters: activeFilters,
    });
    const items = componentLocator(page).getByRole("listitem").elements();

    expect(items.map((item) => item.textContent.trim())).toEqual([
      'Title contains: "login"',
      "Priority: High",
      "Assigned to me",
    ]);
    expect(items[0]).not.toHaveClass("last-part-in-group");
    expect(items[1]).not.toHaveClass("last-part-in-group");
    expect(items[2]).toHaveClass("last-part-in-group");
  });

  it("forwards attributes to the root and labels the list separately", async () => {
    const page = await render(Component, {
      ...baseProps,
      filters: activeFilters,
      id: "summary",
      class: "custom-class",
      style: "color: orange;",
      listLabel: "Task filters",
    });
    const root = componentLocator(page);

    await expect.element(root).toHaveAttribute("id", "summary");
    await expect.element(root).toHaveClass("custom-class");
    await expect.element(root).toHaveStyle({ color: "orange" });
    await expect
      .element(root.getByRole("list"))
      .toHaveAccessibleName("Task filters");
  });

  it("lets the consumer split the visible parts into groups", async () => {
    const page = await render(Component, {
      ...baseProps,
      filters: activeFilters,
      children,
    });
    const items = componentLocator(page).getByRole("listitem").elements();

    expect(items.map((item) => item.textContent.trim())).toEqual([
      'Title contains: "login"',
      "Priority: High",
      "Assigned to me",
    ]);
    expect(items[0]).toHaveClass("last-part-in-group");
    expect(items[1]).not.toHaveClass("last-part-in-group");
    expect(items[2]).toHaveClass("last-part-in-group");
  });

  it("keeps actions outside the list and available when filters are cleared", async () => {
    const page = await render(Component, {
      ...baseProps,
      filters: activeFilters,
      actions,
    });
    const root = componentLocator(page);
    const list = root.getByRole("list");
    const edit = root.getByRole("button", { name: "Edit filters" });

    await expect.element(edit).toBeVisible();
    await expect.element(list.getByRole("button")).not.toBeInTheDocument();

    await page.rerender({ filters: emptyFilters });

    await expect.element(list).not.toBeInTheDocument();
    await expect.element(edit).toBeVisible();
  });
});

function componentLocator(page: LocatorSelectors): Locator {
  return page.getByTestId(testId);
}
