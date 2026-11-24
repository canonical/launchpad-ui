import type { Component as SvelteComponent, ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator, LocatorSelectors } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import FilterSummary from "./FilterSummary.svelte";
import { activeFilters, config, emptyFilters } from "./test.fixtures.js";
import type { TaskFilters } from "./test.fixtures.js";
import type { FilterSummaryProps } from "./types.js";

const Component = FilterSummary as SvelteComponent<
  FilterSummaryProps<TaskFilters>
>;

const testId = "filter-summary";

const baseProps = {
  config,
  filters: activeFilters,
  tableViewName: "Tasks",
  "data-testid": testId,
} satisfies ComponentProps<typeof Component>;

describe("FilterSummary", () => {
  it("renders nothing when no parts are visible", async () => {
    const page = await render(Component, {
      ...baseProps,
      filters: emptyFilters,
    });

    await expect.element(componentLocator(page)).not.toBeInTheDocument();
  });

  it("renders the default group as one flat list", async () => {
    const page = await render(Component, { ...baseProps });
    const items = componentLocator(page)
      .getByRole("list", { name: "Tasks filters" })
      .getByRole("listitem")
      .elements();

    expect(items.map((item) => item.textContent.trim())).toEqual([
      'Title contains: "login"',
      "Priority: High",
      "Assigned to me",
    ]);
    expect(items[0]).not.toHaveClass("last-part-in-group");
    expect(items[1]).not.toHaveClass("last-part-in-group");
    expect(items[2]).toHaveClass("last-part-in-group");
  });

  it("forwards attributes to the root and labels the list from tableViewName", async () => {
    const page = await render(Component, {
      ...baseProps,
      id: "summary",
      class: "custom-class",
      style: "color: orange;",
      tableViewName: "Task",
    });
    const root = componentLocator(page);

    await expect.element(root).toHaveAttribute("id", "summary");
    await expect.element(root).toHaveClass("custom-class");
    await expect.element(root).toHaveStyle({ color: "orange" });
    await expect
      .element(root.getByRole("list", { name: "Task filters" }))
      .toBeVisible();
  });

  it("splits visible parts into groups and appends unlisted keys as a trailing group", async () => {
    const page = await render(Component, {
      ...baseProps,
      groups: [["search"]],
    });
    const items = componentLocator(page)
      .getByRole("list", { name: "Tasks filters" })
      .getByRole("listitem")
      .elements();

    expect(items.map((item) => item.textContent.trim())).toEqual([
      'Title contains: "login"',
      "Priority: High",
      "Assigned to me",
    ]);
    expect(items[0]).toHaveClass("last-part-in-group");
    expect(items[1]).not.toHaveClass("last-part-in-group");
    expect(items[2]).toHaveClass("last-part-in-group");
  });

  it("skips empty groups and deduplicates repeated keys across groups", async () => {
    const page = await render(Component, {
      ...baseProps,
      filters: { ...activeFilters, search: undefined },
      groups: [["search"], ["assignedToMe"], ["assignedToMe", "priority"]],
    });
    const items = componentLocator(page)
      .getByRole("list", { name: "Tasks filters" })
      .getByRole("listitem")
      .elements();

    expect(items.map((item) => item.textContent.trim())).toEqual([
      "Assigned to me",
      "Priority: High",
    ]);
    expect(items[0]).toHaveClass("last-part-in-group");
    expect(items[1]).toHaveClass("last-part-in-group");
  });

  it("renders the edit button outside the list when editTableViewHref is set and keeps it when filters are cleared", async () => {
    const page = await render(Component, {
      ...baseProps,
      editTableViewHref: "/views/tasks/edit",
    });
    const root = componentLocator(page);
    const list = root.getByRole("list", { name: "Tasks filters" });
    const edit = root.getByRole("link", { name: "Edit Tasks view" });

    await expect.element(edit).toBeVisible();
    await expect.element(edit).toHaveAttribute("href", "/views/tasks/edit");
    await expect.element(list.getByRole("link")).not.toBeInTheDocument();

    await page.rerender({ filters: emptyFilters });

    await expect.element(list).not.toBeInTheDocument();
    await expect.element(edit).toBeVisible();
  });

  it("omits the edit button when editTableViewHref is falsy", async () => {
    const page = await render(Component, {
      ...baseProps,
      editTableViewHref: "",
    });
    const root = componentLocator(page);

    await expect.element(root.getByRole("link")).not.toBeInTheDocument();

    await page.rerender({ filters: emptyFilters, editTableViewHref: "" });

    await expect.element(root).not.toBeInTheDocument();
  });
});

function componentLocator(page: LocatorSelectors): Locator {
  return page.getByTestId(testId);
}
