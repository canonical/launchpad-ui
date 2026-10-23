// This could/should be moved somewhere when we notice that config or its parts need to be shared between different routes.
import {
  enumCodec,
  strCodec,
  superhref,
  withActions,
} from "@canonical/superhref";
import type { OwnedKey, SuperhrefPatchInput } from "@canonical/superhref";
import {
  choiceCodec,
  flagCodec,
  launchpadNameCodec,
  paginationCodecs,
  sortCodec,
  textCodec,
} from "#lib/codecs/index.js";
import {
  POCKETS,
  SEARCH_MATCHES,
} from "#lib/modules/packages/filters/constants.js";
import type { PackagesFilters } from "#lib/modules/packages/filters/schema.js";
import {
  ADD_TABLE_VIEW_MODES,
  DEFAULT_TABLE_VIEW_SLUG,
} from "#lib/modules/packages/table-views/constants.js";
import type { AddTableViewMode } from "#lib/modules/packages/table-views/constants.js";

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

const packagesQuerySchema = {
  [BINARY_PACKAGE_QUERY_PARAM]: strCodec(),
  sort: sortCodec(SORTABLE_PACKAGES_COLUMNS),
  view: strCodec({ default: DEFAULT_TABLE_VIEW_SLUG }),
  [PANEL_QUERY_PARAM]: enumCodec([MANAGE_VIEWS_PANEL]),
  [MANAGE_VIEWS_PANEL]: withActions(
    {
      edit: strCodec(),
      add: enumCodec(ADD_TABLE_VIEW_MODES),
    },
    {
      closeForm: (patch) => {
        return patch({ edit: null, add: null });
      },
    },
  ),
  search: textCodec(),
  match: choiceCodec(SEARCH_MATCHES, "contains"),
  series: launchpadNameCodec(),
  pocket: enumCodec(POCKETS),
  maintainer: launchpadNameCodec(),
  signer: launchpadNameCodec(),
  "maintainer-search": textCodec(),
  "signer-search": textCodec(),
  "ubuntu-change": flagCodec(),
  "all-statuses": flagCodec(),
  ...paginationCodecs({
    defaultSize: DEFAULT_PAGE_SIZE,
    maxSize: MAX_PAGE_SIZE,
  }),
};

export const QueryParams = superhref(packagesQuerySchema, {
  actions: {
    setView: (patch, _, view) => {
      return patch({
        view: view === DEFAULT_TABLE_VIEW_SLUG ? null : view,
        page: 1,
      });
    },
    editView: (patch, _, viewId: string) => {
      return patch({
        [PANEL_QUERY_PARAM]: MANAGE_VIEWS_PANEL,
        [MANAGE_VIEWS_PANEL]: { edit: viewId, add: null },
      });
    },
    addView: (patch, _, addMode: AddTableViewMode) => {
      return patch({
        [PANEL_QUERY_PARAM]: MANAGE_VIEWS_PANEL,
        [MANAGE_VIEWS_PANEL]: { add: addMode, edit: null },
      });
    },
  },
});

export type BoundPackagesQueryParams = ReturnType<typeof QueryParams.bind>;

export type PackageOwnedQueryKey = OwnedKey<typeof packagesQuerySchema>;

export const CLEARED_FILTER_PARAMS = {
  search: null,
  series: null,
  pocket: null,
  maintainer: null,
  signer: null,
  "maintainer-search": null,
  "signer-search": null,
  "ubuntu-change": null,
  "all-statuses": null,
} as const satisfies SuperhrefPatchInput<typeof packagesQuerySchema>;

export function toPackagesFilters(
  queryParams: BoundPackagesQueryParams,
): PackagesFilters {
  return {
    search: queryParams.search,
    match: queryParams.match,
    series: queryParams.series,
    pocket: queryParams.pocket,
    maintainer: queryParams.maintainer,
    signer: queryParams.signer,
    ubuntuChange: queryParams["ubuntu-change"],
    allStatuses: queryParams["all-statuses"],
  };
}
