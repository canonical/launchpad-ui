// This could/should be moved somewhere when we notice that config or its parts need to be shared between different routes.

import { strCodec, superhref } from "@canonical/superhref";
import { slugify } from "$lib/utils/index.js";
import { sortCodec } from "$lib/utils/sortCodec.js";

/** The packages table columns, in display order.*/
export const PACKAGES_TABLE_COLUMNS = [
  { key: "source-package", label: "Source package", sortable: true },
  { key: "series", label: "Series", sortable: true },
  { key: "pocket", label: "Pocket", sortable: true },
  { key: "binary-packages", label: "Binary packages", sortable: false },
  { key: "status", label: "Status", sortable: true },
] as const satisfies readonly {
  key: string;
  label: string;
  sortable: boolean;
}[];

export const SORTABLE_PACKAGES_COLUMNS = PACKAGES_TABLE_COLUMNS.flatMap(
  (column) => (column.sortable ? [column.key] : []),
);

// Temporary.
// TODO: Remove when values are served from the backend.
export const TABLE_VIEWS = [
  "All packages",
  "Signed by me",
  "Maintained by me",
].map((tab) => ({ name: tab, slug: slugify(tab) }));
export const DEFAULT_TABLE_VIEW = TABLE_VIEWS[0];

/**
 * Create constant for the superhref key only
 * if it is meant to be used in a place where you
 * cannot rely on types
 */
export const BINARY_PACKAGE_QUERY_PARAM = "binary-package";

export const QueryParams = superhref(
  {
    [BINARY_PACKAGE_QUERY_PARAM]: strCodec(),
    sort: sortCodec(SORTABLE_PACKAGES_COLUMNS),
    view: strCodec({ default: DEFAULT_TABLE_VIEW.slug }),
  },
  {
    actions: {
      setView: (patch, { sort }, view) => {
        const isDefaultView = view === DEFAULT_TABLE_VIEW.slug;
        return patch({
          view: isDefaultView ? null : view,
          sort: isDefaultView ? sort : null,
        });
      },
    },
  },
);

export type BoundPackagesQueryParams = ReturnType<typeof QueryParams.bind>;
