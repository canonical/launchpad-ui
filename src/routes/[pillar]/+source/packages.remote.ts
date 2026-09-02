import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { SORTABLE_PACKAGES_COLUMNS } from "$lib/modules/packages/superhref.js";
import type { PACKAGES_TABLE_COLUMNS } from "$lib/modules/packages/superhref.js";
import { getPublishedSources } from "$lib/server/launchpad/client.js";
import { toSourcePackageListRow } from "$lib/server/launchpad/toSourcePackageListRow.js";
import type { SourcePackageListRow } from "$lib/server/launchpad/toSourcePackageListRow.js";
import type { PublishedSourcesSortKey } from "$lib/server/launchpad/types.js";
import { SORT_DIRECTIONS } from "$lib/utils/sortCodec.js";
import type { SortDirection } from "$lib/utils/sortCodec.js";
import { query } from "$app/server";

const SORT_KEYS = {
  "source-package": "source_package_name",
  series: "series",
  pocket: "pocket",
  status: "status",
} as const satisfies Record<SortablePackagesColumn, PublishedSourcesSortKey>;

const DEFAULT_ORDER_BY = ["-date_created"];

const listArgsSchema = v.object({
  distro: v.pipe(v.string(), v.trim(), v.minLength(1)),
  sortKey: v.nullable(v.picklist(SORTABLE_PACKAGES_COLUMNS)),
  sortOrder: v.picklist(SORT_DIRECTIONS),
  page: v.pipe(v.number(), v.integer(), v.minValue(1)),
  size: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
});

export type PackagesListArgs = v.InferInput<typeof listArgsSchema>;

export type SortablePackagesColumn = Extract<
  (typeof PACKAGES_TABLE_COLUMNS)[number],
  { sortable: true }
>["key"];

export const getSourcePackages = query(
  listArgsSchema,
  async ({
    distro: pillar,
    sortKey,
    sortOrder,
    page,
    size,
  }): Promise<SourcePackageListRow[]> => {
    try {
      const { entries } = await getPublishedSources(pillar, {
        size,
        start: (page - 1) * size,
        orderBy: toOrderBy(sortKey, sortOrder),
      });
      return entries.map(toSourcePackageListRow);
    } catch (requestError) {
      console.error("Failed to load source packages", requestError);
      error(503, "Couldn't load packages from Launchpad. Try again shortly.");
    }
  },
);

function toOrderBy(
  sortKey: SortablePackagesColumn | null,
  sortOrder: SortDirection,
): string[] {
  return sortKey === null || sortOrder === "none"
    ? DEFAULT_ORDER_BY
    : [`${sortOrder === "descending" ? "-" : ""}${SORT_KEYS[sortKey]}`];
}
