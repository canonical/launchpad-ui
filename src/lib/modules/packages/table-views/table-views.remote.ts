import { error, invalid } from "@sveltejs/kit";
import * as v from "valibot";
import { DEFAULT_TABLE_VIEWS } from "./constants.js";
import {
  ParsedTableViewSettingsSchema,
  TableViewEditFormSchema,
  TableViewIdSchema,
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
    id: TableViewIdSchema,
  }),
  ({ id }) => {
    const index = tableViews.findIndex((view) => view.id === id);

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
  const view = tableViews.find((view) => view.id === data.id);

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

  view.name = data.name;
  view.filters = data.filters;
  getTableViews().set(tableViews);
});

/**
 * Reorders `tableViews` to match `views`, and deletes any view whose id is missing from it. Views with `settings` are considered edited.
 *
 * `views` must be a subset of the current views - it cannot introduce new table views.
 */
export const updateTableViews = command(
  v.array(
    v.object({
      id: TableViewIdSchema,
      settings: v.optional(ParsedTableViewSettingsSchema),
    }),
  ),
  (views) => {
    const ids = views.map(({ id }) => id);
    const viewsById = new Map(tableViews.map((view) => [view.id, view]));

    if (new Set(ids).size !== ids.length) {
      error(400, "Duplicate views are not allowed");
    }

    if (ids.some((id) => !viewsById.has(id))) {
      error(400, "Cannot add new table views");
    }

    const removedViews = tableViews.filter((view) => !ids.includes(view.id));
    if (removedViews.some((view) => !view.editable)) {
      error(400, "Cannot remove a table view that is not editable");
    }

    if (
      views.some(({ id, settings }) => settings && !viewsById.get(id)!.editable)
    ) {
      error(400, "Cannot edit a table view that is not editable");
    }

    tableViews = views.map(({ id, settings }) => {
      const view = viewsById.get(id)!;
      return settings ? { ...view, ...settings } : view;
    });
    getTableViews().set(tableViews);
  },
);
