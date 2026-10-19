import { LaunchpadApiError } from "@canonical/launchpad-client";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { SORT_DIRECTIONS } from "$lib/codecs/sortCodec.js";
import { ParsedPackagesFiltersSchema } from "$lib/modules/packages/filters/schema.js";
import {
  launchpadApiBaseUrl,
  launchpadClient,
} from "$lib/server/launchpad/config.js";
import { sourcePackageListSchema } from "./api.schema.js";
import { MAX_BINARY_NAMES } from "./constants.js";
import { MAX_PAGE_SIZE, SORTABLE_PACKAGES_COLUMNS } from "./superhref.js";
import { query } from "$app/server";

const SORT_KEYS = {
  "source-package": "source_package_name",
  series: "series",
  pocket: "pocket",
  status: "status",
} as const satisfies Record<(typeof SORTABLE_PACKAGES_COLUMNS)[number], string>;

const listArgsSchema = v.intersect([
  v.object({
    distro: v.pipe(v.string(), v.trim(), v.minLength(1)),
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
  ParsedPackagesFiltersSchema,
]);

export const getSourcePackages = query(
  listArgsSchema,
  async ({ distro, sortKey, sortOrder, page, size, ...filters }) => {
    try {
      const { data } =
        await launchpadClient.archive.distribution.getSourcePackageList(
          {
            path: { distribution: distro, archive: "primary" },
            query: {
              page: String(page),
              page_size: String(size),
              order_by: JSON.stringify([
                sortKey === null || sortOrder === "none"
                  ? "-date_created"
                  : `${sortOrder === "descending" ? "-" : ""}${SORT_KEYS[sortKey]}`,
              ]),
              include_binaries: "true",
              binary_names_limit: String(MAX_BINARY_NAMES),
              status: JSON.stringify(
                filters.allStatuses
                  ? [
                      "Pending",
                      "Published",
                      "Superseded",
                      "Deleted",
                      "Obsolete",
                    ]
                  : ["Pending", "Published"],
              ),
              distro_series: filters.series
                ? new URL(
                    `${encodeURIComponent(distro)}/${encodeURIComponent(filters.series)}`,
                    launchpadApiBaseUrl,
                  ).href
                : undefined,
              name: filters.search ?? undefined,
              exact_match: filters.search
                ? String(filters.match === "exact")
                : undefined,
              pocket: filters.pocket ?? undefined,
              maintained_by: filters.maintainer
                ? new URL(
                    `~${encodeURIComponent(filters.maintainer)}`,
                    launchpadApiBaseUrl,
                  ).href
                : undefined,
              signed_by: filters.signer
                ? new URL(
                    `~${encodeURIComponent(filters.signer)}`,
                    launchpadApiBaseUrl,
                  ).href
                : undefined,
              ubuntu_change: filters.ubuntuChange ? "true" : undefined,
            },
          },
          // This qastaging-only operation has no documented response contract yet.
          { decode: (value) => v.parse(sourcePackageListSchema, value) },
        );
      return data;
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
