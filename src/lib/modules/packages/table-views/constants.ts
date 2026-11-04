import { slugify } from "$lib/utils/slugify.js";

export const DEFAULT_TABLE_VIEWS = [
  { name: "All packages", editable: false },
  { name: "Signed by me", editable: true },
  { name: "Maintained by me", editable: true },
].map(({ name, editable }) => ({ name, slug: slugify(name), editable }));

export const DEFAULT_TABLE_VIEW_SLUG = DEFAULT_TABLE_VIEWS[0].slug;

export type TableView = (typeof DEFAULT_TABLE_VIEWS)[number];
