// This could/should be moved somewhere when we notice that config or its parts need to be shared between different routes.

import { enumCodec, strCodec, superhref } from "@canonical/superhref";
import { DEFAULT_TABLE_VIEW_SLUG } from "$lib/modules/packages/table-views/constants.js";
import type { Pocket } from "$lib/server/launchpad/types.js";
import { flagCodec } from "$lib/utils/flagCodec.js";
import { launchpadNameCodec } from "$lib/utils/launchpadNameCodec.js";
import { paginationCodecs } from "$lib/utils/paginationCodecs.js";
import { sortCodec } from "$lib/utils/sortCodec.js";
import { textCodec } from "$lib/utils/textCodec.js";

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

/**
 * Create constant for the superhref key only
 * if it is meant to be used in a place where you
 * cannot rely on types
 */
export const BINARY_PACKAGE_QUERY_PARAM = "binary-package";
export const PANEL_QUERY_PARAM = "panel";
export const MANAGE_VIEWS_PANEL = "manage-views";

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, MAX_PAGE_SIZE];

export const SEARCH_MATCHES = ["contains", "exact"] as const;
export const POCKETS = [
  "Release",
  "Security",
  "Updates",
  "Proposed",
  "Backports",
] as const satisfies readonly Pocket[];

export const QueryParams = superhref(
  {
    [BINARY_PACKAGE_QUERY_PARAM]: strCodec(),
    sort: sortCodec(SORTABLE_PACKAGES_COLUMNS),
    view: strCodec({ default: DEFAULT_TABLE_VIEW_SLUG }),
    [PANEL_QUERY_PARAM]: enumCodec([MANAGE_VIEWS_PANEL]),
    [MANAGE_VIEWS_PANEL]: {
      // There is no array codec yet, so only one item can be edited at a time.
      // TODO(superhref): Add array codec and replace this afterwards.
      edit: strCodec(),
    },
    search: textCodec(),
    match: enumCodec(SEARCH_MATCHES),
    series: launchpadNameCodec(),
    pocket: enumCodec(POCKETS),
    maintainer: launchpadNameCodec(),
    signer: launchpadNameCodec(),
    "ubuntu-change": flagCodec(),
    "all-statuses": flagCodec(),
    ...paginationCodecs({
      defaultSize: DEFAULT_PAGE_SIZE,
      maxSize: MAX_PAGE_SIZE,
    }),
  },
  {
    actions: {
      setView: (patch, { sort }, view) => {
        const isDefaultView = view === DEFAULT_TABLE_VIEW_SLUG;
        return patch({
          view: isDefaultView ? null : view,
          sort: isDefaultView ? sort : null,
          page: 1,
        });
      },
    },
  },
);

export type BoundPackagesQueryParams = ReturnType<typeof QueryParams.bind>;
