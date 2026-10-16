import { describe, expect, it } from "vitest";
import { DEFAULT_PACKAGES_FILTERS } from "../filters/constants.js";
import type { PackagesFilters } from "../filters/schema.js";
import {
  DEFAULT_TABLE_VIEWS,
  DEFAULT_TABLE_VIEW_ID,
  DEFAULT_TABLE_VIEW_SLUG,
} from "./constants.js";
import type { TableView } from "./constants.js";
import { resolveTableView } from "./resolveTableView.js";

const urlFilters = {
  ...DEFAULT_PACKAGES_FILTERS,
  search: "from-url",
} satisfies PackagesFilters;

const savedView = {
  id: "mine",
  name: "Mine",
  slug: "mine",
  editable: true,
  filters: {
    ...DEFAULT_PACKAGES_FILTERS,
    search: null,
    series: "noble",
  },
} satisfies TableView;

describe("resolveTableView", () => {
  it("selects All packages by its ID and applies URL filters", () => {
    const result = resolveTableView(
      DEFAULT_TABLE_VIEW_SLUG,
      [savedView, ...DEFAULT_TABLE_VIEWS],
      urlFilters,
    );

    expect(result.view.id).toBe(DEFAULT_TABLE_VIEW_ID);
    expect(result.isDefaultView).toBe(true);
    expect(result.filters).toBe(urlFilters);
  });

  it("falls back to All packages for an unknown slug", () => {
    const result = resolveTableView("unknown", DEFAULT_TABLE_VIEWS, urlFilters);

    expect(result.view.id).toBe(DEFAULT_TABLE_VIEW_ID);
    expect(result.filters).toBe(urlFilters);
  });

  it("uses saved filters instead of URL filters for other views", () => {
    const result = resolveTableView(
      "mine",
      [...DEFAULT_TABLE_VIEWS, savedView],
      {
        ...urlFilters,
        series: "jammy",
      },
    );

    expect(result.view).toBe(savedView);
    expect(result.isDefaultView).toBe(false);
    expect(result.filters).toBe(savedView.filters);
  });

  it("does not rely on the default view's position", () => {
    const views = [...DEFAULT_TABLE_VIEWS].reverse();
    const result = resolveTableView("resolute-packages", views, urlFilters);

    expect(result.view.id).toBe("resolute-packages");
    expect(result.filters).toBe(result.view.filters);
  });
});
