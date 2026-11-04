import { slugify } from "$lib/utils/slugify";

export const DEFAULT_TABLE_VIEWS = [
  { name: "All packages", editable: false },
  { name: "Failed to build", editable: true },
  { name: "Failed testing", editable: true },
].map(({ name, editable }) => ({ name, slug: slugify(name), editable }));

export type TableView = (typeof DEFAULT_TABLE_VIEWS)[number];

export const DEFAULT_TABLE_VIEW_SLUG = DEFAULT_TABLE_VIEWS[0].slug;
