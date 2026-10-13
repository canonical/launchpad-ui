import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";
import { tableViewsStore } from "$lib/server/table-views/index.js";
import { getCurrentUserId } from "$lib/server/user.js";
import { slugify } from "$lib/utils/slugify.js";
import { QueryParams } from "../superhref.js";
import {
  ParsedTableViewSettingsSchema,
  TableViewEditFormSchema,
  TableViewIdSchema,
} from "./schema.js";
import { command, form, getRequestEvent, query } from "$app/server";

export const getTableViews = query(() => {
  return tableViewsStore.get(getCurrentUserId());
});

export const deleteTableView = form(
  v.object({
    id: TableViewIdSchema,
  }),
  async ({ id }) => {
    const userId = getCurrentUserId();
    const tableViews = await tableViewsStore.get(userId);
    const index = tableViews.findIndex((view) => view.id === id);

    if (index === -1) {
      // Already gone
      getTableViews().set(tableViews);
      return;
    }

    if (!tableViews[index].editable) {
      error(400, "This table view cannot be deleted");
    }

    const [deletedView] = tableViews.splice(index, 1);
    await tableViewsStore.set(userId, tableViews);
    getTableViews().set(tableViews);

    const queryParams = QueryParams.bind(getRequestEvent().url);
    if (queryParams.view === deletedView.slug) {
      redirect(303, queryParams.setView(null));
    }
  },
);

/**
 * Saves a single view's settings. Used by the no-JS path only; with JS the edit is staged
 * and sent with {@link updateTableViews} instead.
 *
 * A no-JS person search is submitted here too, so that the other fields' values survive it.
 */
export const editTableView = form(TableViewEditFormSchema, async (data) => {
  const userId = getCurrentUserId();
  const tableViews = await tableViewsStore.get(userId);
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

  const oldSlug = view.slug;
  if (view.name !== data.name) {
    view.slug = uniqueSlug(
      data.name,
      new Set(
        tableViews
          .filter((otherView) => otherView.id !== view.id)
          .map((otherView) => otherView.slug),
      ),
    );
  }
  view.name = data.name;
  view.filters = data.filters;
  await tableViewsStore.set(userId, tableViews);
  getTableViews().set(tableViews);

  const queryParams = QueryParams.bind(getRequestEvent().url);
  if (queryParams.view === oldSlug && view.slug !== oldSlug) {
    redirect(303, queryParams.set("view", view.slug));
  }
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
  async (views) => {
    const userId = getCurrentUserId();
    const currentViews = await tableViewsStore.get(userId);
    const ids = views.map(({ id }) => id);
    const viewsById = new Map(currentViews.map((view) => [view.id, view]));

    if (new Set(ids).size !== ids.length) {
      error(400, "Duplicate views are not allowed");
    }

    if (ids.some((id) => !viewsById.has(id))) {
      error(400, "Cannot add new table views");
    }

    const removedViews = currentViews.filter((view) => !ids.includes(view.id));
    if (removedViews.some((view) => !view.editable)) {
      error(400, "Cannot remove a table view that is not editable");
    }

    if (
      views.some(({ id, settings }) => settings && !viewsById.get(id)!.editable)
    ) {
      error(400, "Cannot edit a table view that is not editable");
    }

    const takenSlugs = new Set<string>(
      // Initialized with the slugs of views that are not being renamed, so that the renames + reorders cannot steal slugs.
      views.flatMap(({ id, settings }) => {
        const view = viewsById.get(id)!;
        return settings && settings.name !== view.name ? [] : [view.slug];
      }),
    );

    const updatedViews = views.map(({ id, settings }) => {
      const view = viewsById.get(id)!;
      if (!settings) return view;

      const renamed = settings.name !== view.name;
      const slug = renamed ? uniqueSlug(settings.name, takenSlugs) : view.slug;
      takenSlugs.add(slug);
      const updatedView = {
        ...view,
        ...settings,
        slug,
      };
      return updatedView;
    });
    await tableViewsStore.set(userId, updatedViews);
    getTableViews().set(updatedViews);
    return updatedViews;
  },
);

function uniqueSlug(name: string, takenSlugs: Set<string>): string {
  const baseSlug = slugify(name) || "view";
  let slug = baseSlug;
  let suffix = 2;

  while (takenSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }

  return slug;
}
