import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { SORT_DIRECTIONS } from "$lib/codecs/sortCodec.js";
import {
  MAX_PAGE_SIZE,
  POCKETS,
  SEARCH_MATCHES,
  SORTABLE_PACKAGES_COLUMNS,
} from "$lib/modules/packages/superhref.js";
import {
  LaunchpadApiError,
  getPublishedSources,
  getPublishedSourcesTotal,
} from "$lib/server/launchpad/client.js";
import type {
  PublishedSourcesFilter,
  PublishedSourcesSortKey,
  SourcePackagePublishingEntry,
} from "$lib/server/launchpad/types.js";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName.js";
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

const MAX_SEARCH_LENGTH = 200;

const distroSchema = v.pipe(v.string(), v.trim(), v.minLength(1));
const launchpadNameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));

const filterArgsSchema = v.pipe(
  v.object({
    search: v.nullish(
      v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1),
        v.maxLength(MAX_SEARCH_LENGTH),
      ),
    ),
    match: v.nullish(v.picklist(SEARCH_MATCHES)),
    series: v.nullish(launchpadNameSchema),
    pocket: v.nullish(v.picklist(POCKETS)),
    maintainer: v.nullish(launchpadNameSchema),
    signer: v.nullish(launchpadNameSchema),
    ubuntuChange: v.nullish(v.boolean()),
    allStatuses: v.nullish(v.boolean()),
  }),
  v.transform(
    (filters): PublishedSourcesFilter => ({
      series: filters.series,
      status: filters.allStatuses
        ? undefined
        : ["Pending", "Published", "Obsolete"],
      sourceName: filters.search,
      exactMatch: filters.match === "exact",
      pocket: filters.pocket,
      maintainedBy: filters.maintainer,
      signedBy: filters.signer,
      ubuntuChange: filters.ubuntuChange,
    }),
  ),
);

const listArgsSchema = v.intersect([
  v.object({
    distro: distroSchema,
    sortKey: v.nullable(v.picklist(SORTABLE_PACKAGES_COLUMNS)),
    sortOrder: v.picklist(SORT_DIRECTIONS),
    page: v.pipe(v.number(), v.integer(), v.minValue(1)),
    size: v.pipe(
      v.number(),
      v.integer(),
      v.minValue(1),
      v.maxValue(MAX_PAGE_SIZE),
    ),
  }),
  filterArgsSchema,
]);

const totalArgsSchema = v.intersect([
  v.object({ distro: distroSchema }),
  filterArgsSchema,
]);

type PackagesListing = {
  data: SourcePackagePublishingEntry[];
  hasNext: boolean;
};

const EMPTY_LISTING: PackagesListing = { data: [], hasNext: false };

export const getSourcePackages = query(
  listArgsSchema,
  async ({
    distro,
    sortKey,
    sortOrder,
    page,
    size,
    ...filters
  }): Promise<PackagesListing> => {
    try {
      const { entries, next_collection_link } = await getPublishedSources(
        distro,
        {
          ...filters,
          size,
          start: (page - 1) * size,
          orderBy:
            sortKey === null || sortOrder === "none"
              ? ["-date_created"]
              : [
                  `${sortOrder === "descending" ? "-" : ""}${SORT_KEYS[sortKey]}`,
                ],
        },
      );
      return { data: entries, hasNext: next_collection_link !== undefined };
    } catch (requestError) {
      console.error("Failed to load source packages", requestError);
      if (isRejectedFilter(requestError)) {
        return EMPTY_LISTING;
      }
      error(503, "Couldn't load packages from Launchpad. Try again shortly.");
    }
  },
);

export const getSourcePackagesTotal = query(
  totalArgsSchema,
  async ({ distro, ...filters }): Promise<number | null> => {
    try {
      return await getPublishedSourcesTotal(distro, filters);
    } catch (requestError) {
      console.error("Failed to count source packages", requestError);
      if (isRejectedFilter(requestError)) {
        return 0;
      }
      return null;
    }
  },
);

function isRejectedFilter(requestError: unknown): boolean {
  return (
    requestError instanceof LaunchpadApiError && requestError.status === 400
  );
}
