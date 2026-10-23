import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { SORT_DIRECTIONS } from "$lib/codecs/sortCodec.js";
import { ParsedPackagesFiltersSchema } from "$lib/modules/packages/filters/schema.js";
import {
  LaunchpadApiError,
  getSourcePackageList,
} from "$lib/server/launchpad/client.js";
import type {
  SourcePackageList,
  SourcePackageListFilter,
  SourcePackageSortKey,
} from "$lib/server/launchpad/types.js";
import { MAX_PAGE_SIZE, SORTABLE_PACKAGES_COLUMNS } from "./superhref.js";
import { query } from "$app/server";

const SORT_KEYS = {
  "source-package": "source_package_name",
  series: "series",
  pocket: "pocket",
  status: "status",
} as const satisfies Record<
  (typeof SORTABLE_PACKAGES_COLUMNS)[number],
  SourcePackageSortKey
>;

const distroSchema = v.pipe(v.string(), v.trim(), v.minLength(1));

const filterArgsSchema = v.pipe(
  ParsedPackagesFiltersSchema,
  v.transform((filters): SourcePackageListFilter => ({
    series: filters.series,
    statuses: filters.allStatuses
      ? ["Pending", "Published", "Superseded", "Deleted", "Obsolete"]
      : ["Pending", "Published"],
    sourceName: filters.search,
    exactMatch: filters.match === "exact",
    pocket: filters.pocket,
    maintainedBy: filters.maintainer,
    signedBy: filters.signer,
    ubuntuChange: filters.ubuntuChange,
  })),
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

export const getSourcePackages = query(
  listArgsSchema,
  async ({
    distro,
    sortKey,
    sortOrder,
    page,
    size,
    ...filters
  }): Promise<SourcePackageList> => {
    try {
      return await getSourcePackageList(distro, {
        ...filters,
        size,
        page,
        orderBy:
          sortKey === null || sortOrder === "none"
            ? ["-date_created"]
            : [`${sortOrder === "descending" ? "-" : ""}${SORT_KEYS[sortKey]}`],
      });
    } catch (requestError) {
      console.error("Failed to load source packages", requestError);
      if (
        requestError instanceof LaunchpadApiError &&
        requestError.status === 400
      ) {
        return {
          sources: [],
          total: 0,
          total_pages: 0,
          page,
          page_size: size,
        };
      }
      error(503, "Couldn't load packages from Launchpad. Try again shortly.");
    }
  },
);
