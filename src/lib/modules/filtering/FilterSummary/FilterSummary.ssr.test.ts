import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./FilterSummary.svelte";
import { activeFilters, config, emptyFilters } from "./test.fixtures.js";
import type { TaskFilters } from "./test.fixtures.js";

const testId = "filter-summary";

const baseProps = {
  config,
  filters: activeFilters,
  tableViewName: "Tasks",
  "data-testid": testId,
} satisfies ComponentProps<typeof Component<TaskFilters>>;

describe("FilterSummary SSR", () => {
  it("renders the summary list", () => {
    const page = render(Component, {
      props: { ...baseProps },
    });
    const list = page.getByRole("list", { name: "Tasks filters" });

    expect(componentLocator(page).contains(list)).toBe(true);
    expect(list.textContent).toContain("Title contains");
    expect(page.queryByRole("link")).toBeNull();
  });

  it("renders the edit button when editTableViewHref is set", () => {
    const page = render(Component, {
      props: {
        ...baseProps,
        editTableViewHref: "/views/tasks/edit",
      },
    });
    const root = componentLocator(page);
    const list = page.getByRole("list", { name: "Tasks filters" });
    const edit = page.getByRole("link", { name: "Edit Tasks view" });

    expect(root.contains(list)).toBe(true);
    expect(root.contains(edit)).toBe(true);
    expect(list.contains(edit)).toBe(false);
    expect(edit.getAttribute("href")).toBe("/views/tasks/edit");
  });

  it("renders the edit button even when no summary parts are visible", () => {
    const page = render(Component, {
      props: {
        ...baseProps,
        filters: emptyFilters,
        editTableViewHref: "/views/tasks/edit",
      },
    });
    const edit = page.getByRole("link", { name: "Edit Tasks view" });

    expect(componentLocator(page).contains(edit)).toBe(true);
    expect(page.queryByRole("list")).toBeNull();
  });

  it("renders nothing when no summary parts are visible and editTableViewHref is not set", () => {
    const page = render(Component, {
      props: {
        ...baseProps,
        filters: emptyFilters,
      },
    });

    expect(page.queryByTestId(testId)).toBeNull();
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId(testId);
}
