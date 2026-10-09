import { error } from "@sveltejs/kit";
import * as v from "valibot";
import {
  LaunchpadApiError,
  getActiveSeriesMilestones,
  getDistroSeries,
} from "$lib/server/launchpad/client.js";
import type { DistroSeriesEntry } from "$lib/server/launchpad/types.js";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName.js";
import { query } from "$app/server";

const nameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));

export const getSeriesOverview = query(
  v.object({
    pillar: nameSchema,
    series: nameSchema,
  }),
  async ({ pillar, series }) => {
    try {
      const [entry, milestones] = await Promise.all([
        getDistroSeries(pillar, series),
        getActiveSeriesMilestones(pillar, series),
      ]);

      const seriesPath = new URL(entry.web_link).pathname;

      return {
        displayName: `${entry.version}${isLts(entry, pillar) ? " LTS" : ""} ${entry.displayname}`,
        distribution: {
          displayName: pillar.charAt(0).toUpperCase() + pillar.slice(1),
          url: `/${pillar}`,
        },
        status: entry.status,
        description: entry.summary,
        links: {
          reportBug: `https://bugs.launchpad.net/${pillar}/+filebug`,
          askQuestion: `https://answers.launchpad.net/${pillar}/+addquestion`,
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
function isLts(entry: DistroSeriesEntry, pillar: string) {
  return pillar === "ubuntu" && /^\d[02468]\.04$/.test(entry.version);
}
