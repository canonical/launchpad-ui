import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";
import { tableViewsStore } from "$lib/server/table-views/index.js";
import { getCurrentUserId } from "$lib/server/user.js";
import { slugify } from "$lib/utils/slugify.js";
import { QueryParams } from "../superhref.js";
import type { TableView } from "./constants.js";
import {
  ParsedTableViewSettingsSchema,
  TableViewEditFormSchema,
  TableViewIdSchema,
} from "./schema.js";
import type { TableViewSettings } from "./schema.js";
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
    redirect(303, queryParams.patch({ view: view.slug, "manage-views": null }));
  }

  redirect(303, queryParams.patch({ "manage-views": null }));
});

/**
 * Creates a view. Used by the no-JS path only; with JS the new view is staged
 * and sent with {@link updateTableViews} instead.
 */
export const createTableView = form(TableViewEditFormSchema, async (data) => {
  if (data.intent !== undefined && data.intent !== "confirm") {
    // Re-renders the form with the submitted values, which kit only keeps for an invalid submission.
    invalid("The view hasn't been saved yet");
  }

  const userId = getCurrentUserId();
  const tableViews = assignSlugs([
    ...(await tableViewsStore.get(userId)),
    newTableView(data),
  ]);
  await tableViewsStore.set(userId, tableViews);
  getTableViews().set(tableViews);

  const queryParams = QueryParams.bind(getRequestEvent().url);
  redirect(303, queryParams.patch({ "manage-views": null }));
});

/**
 * Reorders `tableViews` to match `views`, and deletes any view whose id is missing from it. Views with `settings` are considered edited, and views without an `id` are created.
 */
export const updateTableViews = command(
  v.array(
    v.union([
      v.object({
        id: TableViewIdSchema,
        settings: v.optional(ParsedTableViewSettingsSchema),
      }),
      v.object({
        settings: ParsedTableViewSettingsSchema,
      }),
    ]),
  ),
  async (views) => {
    const userId = getCurrentUserId();
    const currentViews = await tableViewsStore.get(userId);
    const viewsById = new Map(currentViews.map((view) => [view.id, view]));
    const ids = views.flatMap((view) => ("id" in view ? [view.id] : []));

    if (new Set(ids).size !== ids.length) {
      error(400, "Duplicate views are not allowed");
    }

    if (currentViews.some((view) => !view.editable && !ids.includes(view.id))) {
      error(400, "Cannot remove a table view that is not editable");
    }

    const updatedViews = assignSlugs(
      views.map((view): UnsluggedTableView => {
        if (!("id" in view)) return newTableView(view.settings);

        const currentView = viewsById.get(view.id);
        if (!currentView) {
          error(400, "Unknown table view");
        }
        if (!view.settings) return currentView;
        if (!currentView.editable) {
          error(400, "Cannot edit a table view that is not editable");
        }

        const renamed = view.settings.name !== currentView.name;
        return {
          ...currentView,
          ...view.settings,
          slug: renamed ? null : currentView.slug,
        };
      }),
    );
    await tableViewsStore.set(userId, updatedViews);
    getTableViews().set(updatedViews);
    return updatedViews;
  },
);

/** `slug: null` marks a view that needs a new slug. */
type UnsluggedTableView = Omit<TableView, "slug"> & { slug: string | null };

function newTableView({
  name,
  filters,
}: TableViewSettings): UnsluggedTableView {
  return {
    id: crypto.randomUUID(),
    name,
    slug: null,
    editable: true,
    filters,
  };
}

/** Existing slugs are reserved first, so new and renamed views can't take them. */
function assignSlugs(views: UnsluggedTableView[]): TableView[] {
  const takenSlugs = new Set(
    views.map(({ slug }) => slug).filter((slug) => slug !== null),
  );
  return views.map((view) => {
    const slug = view.slug ?? uniqueSlug(view.name, takenSlugs);
    takenSlugs.add(slug);
    return { ...view, slug };
  });
}

function uniqueSlug(name: string, takenSlugs: Set<string>): string {
  const baseSlug = slugify(name) || "view";
  let slug = baseSlug;
  let suffix = 2;

  while (takenSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }

  return slug;
}
