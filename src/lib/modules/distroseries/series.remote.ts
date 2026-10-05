import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName.js";
import { query } from "$app/server";

const nameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));

//TODO: Update with real data ticket
export const getSeriesOverview = query(
  v.object({
    pillar: nameSchema,
    series: nameSchema,
  }),
  ({ pillar, series }) => {
    if (pillar !== "ubuntu" || series !== "resolute") {
      error(404, "Series not found");
    }

    return {
      displayName: "26.04 LTS (Resolute Raccoon)",
      distribution: {
        displayName: "Ubuntu",
        url: "https://launchpad.net/ubuntu",
      },
      status: "Active Development",
      description:
        "The Ubuntu series that will be released in April 2026, designated 26.04.",
      links: {
        reportBug: "https://bugs.launchpad.net/ubuntu/+filebug",
        askQuestion: "https://answers.launchpad.net/ubuntu/+addquestion",
        translate: "https://translations.launchpad.net/ubuntu/resolute",
        subscribeToBugs:
          "https://bugs.launchpad.net/ubuntu/resolute/+subscribe",
        milestones: "https://launchpad.net/ubuntu/+milestones",
      },
      milestones: [
        {
          name: "ubuntu-26.04",
          date: "2026-04-23",
          url: "https://launchpad.net/ubuntu/+milestone/ubuntu-26.04",
        },
        {
          name: "ubuntu-26.04.1",
          date: "2026-08-27",
          url: "https://launchpad.net/ubuntu/+milestone/ubuntu-26.04.1",
        },
        {
          name: "resolute-updates",
          date: "2031-04-23",
          url: "https://launchpad.net/ubuntu/+milestone/resolute-updates",
        },
      ],
    };
  },
);
