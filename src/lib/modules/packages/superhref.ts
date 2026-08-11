// This could/should be moved somewhere when we notice that config or its parts need to be shared between different routes.

import { strCodec, superhref } from "@canonical/superhref";
import { sortCodec } from "$lib/utils/sortCodec.js";

export const BINARY_PACKAGE_QUERY_PARAM = "binary-package" as const;

/** The packages table columns, in display order. Every one is sortable. */
export const PACKAGES_TABLE_COLUMNS = [
  { key: "source-package", label: "Source package" },
  { key: "series", label: "Series" },
  { key: "pocket", label: "Pocket" },
  { key: "binary-packages", label: "Binary packages" },
  { key: "status", label: "Status" },
] as const satisfies readonly { key: string; label: string }[];

export const QueryParams = superhref({
  [BINARY_PACKAGE_QUERY_PARAM]: strCodec(),
  sort: sortCodec(PACKAGES_TABLE_COLUMNS.map(({ key }) => key)),
});

export type BoundPackagesQueryParams = ReturnType<typeof QueryParams.bind>;
