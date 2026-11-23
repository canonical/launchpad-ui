import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./FilterSummary.svelte";
import { activeFilters, config, emptyFilters } from "./test.fixtures.svelte";

describe("FilterSummary SSR", () => {
  it("renders the summary list", () => {
    const page = render(Component, {
      props: {
        config,
        filters: activeFilters,
      },
    });

    expect(componentLocator(page).textContent).toContain("Title contains");
  });

  it("renders nothing when no summary parts are visible", () => {
    const page = render(Component, {
      props: {
        config,
        filters: emptyFilters,
      },
    });

    expect(page.queryByRole("list")).toBeNull();
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("list");
}
