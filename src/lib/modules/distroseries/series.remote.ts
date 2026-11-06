import { LaunchpadApiError } from "@canonical/launchpad-client";
import type { DistroSeriesFull } from "@canonical/launchpad-client/schemas/models/distro_series";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { distroSeriesSchema, launchpadNameSchema } from "#lib/schemas/index.js";
import { launchpadClient } from "#lib/server/launchpad/client.js";
import { query } from "$app/server";

export const getSeriesOverview = query(
  distroSeriesSchema,
  async ({ distro, series }) => {
    try {
      const [{ data: entry }, { data: milestones }] = await Promise.all([
        launchpadClient.distroSeries.series.get({
          path: { distribution: distro, series },
        }),
        launchpadClient.distroSeries.series.searchMilestones({
          path: { distribution: distro, series },
          query: {
            is_active: "true",
            order_by: "date_targeted",
            "ws.size": 3,
          },
        }),
      ]);

      const seriesPath = new URL(entry.web_link).pathname;

      return {
        displayName: seriesDisplayName(entry, distro),
        distribution: {
          displayName: distro.charAt(0).toUpperCase() + distro.slice(1),
          url: `/${distro}`,
        },
        status: entry.status,
        description: entry.summary,
        links: {
          reportBug: `https://bugs.launchpad.net/${distro}/+filebug`,
          askQuestion: `https://answers.launchpad.net/${distro}/+addquestion`,
          translate:
            entry.translations_usage === "Launchpad"
              ? `https://translations.launchpad.net${seriesPath}`
              : undefined,
          subscribeToBugs: `https://bugs.launchpad.net${seriesPath}/+subscribe`,
          milestones: `${entry.web_link}/+milestones`,
        },
        milestones: milestones.entries.slice(0, 3).map((milestone) => ({
          name: milestone.name,
          date: milestone.date_targeted,
          url: milestone.web_link,
        })),
      };
    } catch (requestError) {
      if (
        requestError instanceof LaunchpadApiError &&
        requestError.status === 404
      ) {
        error(404, "Series not found");
      }
      console.error("Failed to load series overview", requestError);
      error(503, "Couldn't load series from Launchpad. Try again shortly.");
    }
  },
);

export const getSeriesGroups = query(
  v.object({ distro: launchpadNameSchema }),
  async ({ distro }) => {
    try {
      const {
        data: { entries },
      } = await launchpadClient.distribution.series.get({
        path: { distribution: distro },
      });
      const entriesByStatus = Map.groupBy(
        entries.filter((entry) => entry.status !== "Obsolete"),
        (entry) => entry.status,
      );

      return Array.from(entriesByStatus, ([status, statusEntries]) => ({
        status,
        series: statusEntries.map((entry) => ({
          name: entry.name,
          displayName: seriesDisplayName(entry, distro),
        })),
      }));
    } catch (requestError) {
      console.error("Failed to load distro series", requestError);
      return [];
    }
  },
);

function seriesDisplayName(
  entry: Pick<DistroSeriesFull, "version" | "displayname">,
  distro: string,
) {
  return `${entry.version}${isLts(entry, distro) ? " LTS" : ""} ${entry.displayname}`;
}

// TODO: Bring it up during the sprint in Mexico. Update with the decision. This code shouldn't be here in 2027
// A very bad way to determine if a series is LTS
// but there is no flag returned from launchpad
// Any ideas welcome
// We can query this https://changelogs.ubuntu.com/meta-release-lts
// and check if the series is in there but
// its one more request and also ubuntu-only
// Flavours are, probably, LTS if based on Ubuntu LTS
// Elementary OS has no LTS marker
// For linux mint every version is marked as LTS
function isLts(entry: Pick<DistroSeriesFull, "version">, distro: string) {
  return distro === "ubuntu" && /^\d[02468]\.04$/.test(entry.version);
}
