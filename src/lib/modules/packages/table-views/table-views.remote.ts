import { error, invalid } from "@sveltejs/kit";
import * as v from "valibot";
import { DEFAULT_TABLE_VIEWS } from "./constants.js";
import {
  TableViewEditFormSchema,
  TableViewSettingsSchema,
  TableViewSlugSchema,
} from "./schema.js";
import { command, form, query } from "$app/server";

// TODO: Replace with persistent per-user storage
/** Temporary, in-memory, shared-by-all table-views state */
let tableViews = [...DEFAULT_TABLE_VIEWS];

export const getTableViews = query(() => {
  return tableViews;
});

export const deleteTableView = form(
  v.object({
    slug: TableViewSlugSchema,
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
 * Saves a single view's settings. Used by the no-JS path only; with JS the edit is staged
 * and sent with {@link updateTableViews} instead.
 *
 * A no-JS person search is submitted here too, so that the other fields' values survive it.
 */
export const editTableView = form(TableViewEditFormSchema, (data) => {
  const view = tableViews.find((view) => view.slug === data.id);

  if (!view) {
    error(404, "This table view no longer exists");
  }

  if (!view.editable) {
    error(400, "This table view cannot be edited");
  }

  if (data.intent !== undefined && data.intent !== "confirm") {
    // Re-renders the form with the submitted values, which kit only keeps for an invalid submission.
    invalid("The view hasn't been saved yet");
  }

  // TODO: Persist the view settings
  console.log("editTableView", data);
});

/**
 * Reorders `tableViews` to match `views`, and deletes any view whose slug is missing from it.
 *
 * `views` must be a subset of the current views - it cannot introduce new table views.
 * Views with `settings` have been edited.
 */
export const updateTableViews = command(
  v.array(
    v.object({
      slug: TableViewSlugSchema,
      settings: v.optional(TableViewSettingsSchema),
    }),
  ),
  (views) => {
    const slugs = views.map(({ slug }) => slug);
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

    if (
      views.some(
        ({ slug, settings }) => settings && !viewsBySlug.get(slug)!.editable,
      )
    ) {
      error(400, "Cannot edit a table view that is not editable");
    }

    // TODO: Persist the edited views' settings
    console.log("updateTableViews", views);
    tableViews = slugs.map((slug) => viewsBySlug.get(slug)!);
    getTableViews().set(tableViews);
  },
);
