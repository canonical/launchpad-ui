import { slugify } from "$lib/utils/slugify.js";

export const MAX_TABLE_VIEW_NAME_LENGTH = 100;

export const DEFAULT_TABLE_VIEWS = [
  { id: "all-packages", name: "All packages", editable: false },
  { id: "signed-by-me", name: "Signed by me", editable: true },
  { id: "maintained-by-me", name: "Maintained by me", editable: true },
].map(({ id, name, editable }) => ({
  id,
  name,
  slug: slugify(name),
  editable,
}));

export const DEFAULT_TABLE_VIEW_SLUG = DEFAULT_TABLE_VIEWS[0].slug;

export type TableView = (typeof DEFAULT_TABLE_VIEWS)[number];
