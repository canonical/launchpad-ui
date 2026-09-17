import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { DEFAULT_TABLE_VIEWS } from "./constants.js";
import { command, form, query } from "$app/server";

// TODO: Replace with persistent per-user storage
/** Temporary, in-memory, shared-by-all table-views state */
let tableViews = [...DEFAULT_TABLE_VIEWS];

export const getTableViews = query(() => {
  return tableViews;
});

export const deleteTableView = form(
  v.object({
    slug: v.pipe(v.string(), v.nonEmpty()),
  }),
  ({ slug }) => {
    const index = tableViews.findIndex((view) => view.slug === slug);

    if (index === -1) {
      // Already gone
      getTableViews().set(tableViews);
      return;
    }

    if (!tableViews[index].editable) {
      error(400, "This table view cannot be deleted");
    }

    tableViews.splice(index, 1);
    getTableViews().set(tableViews);
  },
);

/**
 * Reorders `tableViews` to match `slugs`, and deletes any view whose slug is missing from it.
 *
 * `slugs` must be a subset of the current slugs - it cannot introduce new table views.
 */
export const updateTableViews = command(
  v.array(v.pipe(v.string(), v.nonEmpty())),
  (slugs) => {
    const viewsBySlug = new Map(tableViews.map((view) => [view.slug, view]));

    if (new Set(slugs).size !== slugs.length) {
      error(400, "Duplicate views are not allowed");
    }

    if (slugs.some((slug) => !viewsBySlug.has(slug))) {
      error(400, "Cannot add new table views");
    }

    const removedViews = tableViews.filter(
      (view) => !slugs.includes(view.slug),
    );
    if (removedViews.some((view) => !view.editable)) {
      error(400, "Cannot remove a table view that is not editable");
    }

    tableViews = slugs.map((slug) => viewsBySlug.get(slug)!);
    getTableViews().set(tableViews);
  },
);
