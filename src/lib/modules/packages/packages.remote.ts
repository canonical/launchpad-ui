import { LaunchpadApiError } from "@canonical/launchpad-client";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { ParsedPackagesFiltersSchema } from "#lib/modules/packages/filters/schema.js";
import {
  createSortingSchema,
  launchpadNameSchema,
  paginationSchema,
} from "#lib/schemas/index.js";
import { launchpadClient } from "#lib/server/launchpad/client.js";
import { launchpadUrl } from "#lib/server/launchpad/launchpadUrl.js";
import { sourcePackageListSchema } from "./api.schema.js";
import { MAX_BINARY_NAMES } from "./constants.js";
import { SORTABLE_PACKAGES_COLUMNS } from "./superhref.js";
import { query } from "$app/server";

const SORT_KEYS = {
  "source-package": "source_package_name",
  series: "series",
  pocket: "pocket",
  status: "status",
} as const satisfies Record<(typeof SORTABLE_PACKAGES_COLUMNS)[number], string>;

const listArgsSchema = v.intersect([
  createSortingSchema(SORTABLE_PACKAGES_COLUMNS),
  paginationSchema,
  v.object({
    distro: launchpadNameSchema,
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
              distro_series: launchpadUrl(distro, filters.series),
              name: filters.search ?? undefined,
              exact_match: filters.search
                ? String(filters.match === "exact")
                : undefined,
              pocket: filters.pocket ?? undefined,
              maintained_by: launchpadUrl("~", filters.maintainer),
              signed_by: launchpadUrl("~", filters.signer),
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
