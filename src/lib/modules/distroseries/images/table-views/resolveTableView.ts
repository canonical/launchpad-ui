import type { ImagesFilters } from "../filters/schema.js";
import { DEFAULT_TABLE_VIEW_ID } from "./constants.js";
import type { TableView } from "./constants.js";

/**
 * Resolves the active image view, falling back to the default when the slug is unknown.
 * Applies URL filters to the default view and saved filters to all other views.
 */
export function resolveTableView(
  viewSlug: string,
  views: TableView[],
  urlFilters: ImagesFilters,
) {
  const defaultView = views.find(({ id }) => id === DEFAULT_TABLE_VIEW_ID)!;
  const view = views.find(({ slug }) => slug === viewSlug) ?? defaultView;
  const isDefaultView = view.id === DEFAULT_TABLE_VIEW_ID;

  return {
    view,
    filters: isDefaultView ? urlFilters : view.filters,
    isDefaultView,
  };
}
