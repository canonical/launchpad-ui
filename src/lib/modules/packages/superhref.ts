// This could/should be moved somewhere when we notice that config or its parts need to be shared between different routes.

import { strCodec, superhref } from "@canonical/superhref";
import { sortCodec } from "$lib/utils/sortCodec.js";

export const BINARY_PACKAGE_QUERY_PARAM = "binary-package" as const;

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

export const QueryParams = superhref({
  [BINARY_PACKAGE_QUERY_PARAM]: strCodec(),
  sort: sortCodec(SORTABLE_PACKAGES_COLUMNS),
});

export type BoundPackagesQueryParams = ReturnType<typeof QueryParams.bind>;
