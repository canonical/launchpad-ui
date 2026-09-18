import { error } from "@sveltejs/kit";
import * as v from "valibot";
import {
  MAX_PAGE_SIZE,
  SORTABLE_PACKAGES_COLUMNS,
} from "$lib/modules/packages/superhref.js";
import {
  getPublishedSources,
  getPublishedSourcesTotal,
} from "$lib/server/launchpad/client.js";
import type {
  PublishedSourcesSortKey,
  PublishingStatus,
  SourcePackagePublishingEntry,
} from "$lib/server/launchpad/types.js";
import { SORT_DIRECTIONS } from "$lib/utils/sortCodec.js";
import type { SortDirection } from "$lib/utils/sortCodec.js";
import { query } from "$app/server";

const SORT_KEYS = {
  "source-package": "source_package_name",
  series: "series",
  pocket: "pocket",
  status: "status",
} as const satisfies Record<
  (typeof SORTABLE_PACKAGES_COLUMNS)[number],
  PublishedSourcesSortKey
>;

const DEFAULT_ORDER_BY = ["-date_created"];
const LISTED_STATUSES: PublishingStatus[] = [
  "Pending",
  "Published",
  "Obsolete",
];

const distroSchema = v.pipe(v.string(), v.trim(), v.minLength(1));
const seriesSchema = v.optional(v.pipe(v.string(), v.trim(), v.minLength(1)));

const listArgsSchema = v.object({
  distro: distroSchema,
  series: seriesSchema,
  sortKey: v.nullable(v.picklist(SORTABLE_PACKAGES_COLUMNS)),
  sortOrder: v.picklist(SORT_DIRECTIONS),
  page: v.pipe(v.number(), v.integer(), v.minValue(1)),
  size: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1),
    v.maxValue(MAX_PAGE_SIZE),
  ),
});

const totalArgsSchema = v.object({
  distro: distroSchema,
  series: seriesSchema,
});


export const getSourcePackages = query(
  listArgsSchema,
  async ({
    distro,
    series,
    sortKey,
    sortOrder,
    page,
    size,
  }): Promise<{
  data: SourcePackagePublishingEntry[];
  hasNext: boolean;
}> => {
    try {
      const { entries, next_collection_link } = await getPublishedSources(
        distro,
        {
          series,
          status: LISTED_STATUSES,
          size,
          start: (page - 1) * size,
          orderBy: toOrderBy(sortKey, sortOrder),
        },
      );
      return { data: entries, hasNext: next_collection_link !== undefined };
    } catch (requestError) {
      console.error("Failed to load source packages", requestError);
      error(503, "Couldn't load packages from Launchpad. Try again shortly.");
    }
  },
);

export const getSourcePackagesTotal = query(
  totalArgsSchema,
  async ({ distro, series }): Promise<number | null> => {
    try {
      return await getPublishedSourcesTotal(distro, {
        series,
        status: LISTED_STATUSES,
      });
    } catch (requestError) {
      console.error("Failed to count source packages", requestError);
      return null;
    }
  },
);

function toOrderBy(
  sortKey: (typeof SORTABLE_PACKAGES_COLUMNS)[number] | null,
  sortOrder: SortDirection,
): string[] {
  return sortKey === null || sortOrder === "none"
    ? DEFAULT_ORDER_BY
    : [`${sortOrder === "descending" ? "-" : ""}${SORT_KEYS[sortKey]}`];
}
