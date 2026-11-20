import { LaunchpadApiError } from "@canonical/launchpad-client";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { distroSeriesSchema } from "#lib/schemas/index.js";
import { launchpadClient } from "#lib/server/launchpad/client.js";
import { bugTaskCountsSchema } from "./api.schema.js";
import { query } from "$app/server";

export const getSeriesBugCounts = query(
  distroSeriesSchema,
  async ({ distro, series }) => {
    try {
      const unresolvedBugTasks =
        await launchpadClient.distroSeries.series.searchTasksCounts(
          { path: { distribution: distro, series } },
          { decode: (value) => v.parse(bugTaskCountsSchema, value) },
        );

      return {
        open: unresolvedBugTasks.data.total,
        critical: unresolvedBugTasks.data.by_importance.CRITICAL,
        inProgress: unresolvedBugTasks.data.by_status.INPROGRESS,
      };
    } catch (requestError) {
      if (
        requestError instanceof LaunchpadApiError &&
        requestError.status === 404
      ) {
        error(404, "Series not found");
      }
      console.error("Failed to load series bug counts", requestError);
      error(503, "Couldn't load bug counts from Launchpad. Try again shortly.");
    }
  },
);
