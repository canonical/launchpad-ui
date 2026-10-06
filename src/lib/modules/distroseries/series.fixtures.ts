import type {
  Collection,
  DistroSeriesEntry,
  MilestoneEntry,
} from "$lib/server/launchpad/types.js";
import type { getSeriesOverview } from "./series.remote.js";

export const distroSeries = {
  version: "26.04",
  title: "The Resolute Raccoon",
  status: "Current Stable Release",
  summary:
    "The Ubuntu release that will be delivered in April 2026, designated 26.04.",
  web_link: "https://launchpad.net/ubuntu/resolute",
  translations_usage: "Launchpad",
} satisfies DistroSeriesEntry;

export const activeSeriesMilestones = {
  start: 0,
  entries: [
    {
      name: "ubuntu-26.04.1",
      date_targeted: "2026-08-27",
      web_link: "https://launchpad.net/ubuntu/+milestone/ubuntu-26.04.1",
    },
    {
      name: "ubuntu-26.04.2",
      date_targeted: "2027-02-18",
      web_link: "https://launchpad.net/ubuntu/+milestone/ubuntu-26.04.2",
    },
    {
      name: "resolute-updates",
      date_targeted: "2031-04-23",
      web_link: "https://launchpad.net/ubuntu/+milestone/resolute-updates",
    },
  ],
} satisfies Collection<MilestoneEntry>;

export const seriesOverview = {
  displayName: "26.04 LTS (Resolute Raccoon)",
  distribution: {
    displayName: "Ubuntu",
    url: "/ubuntu",
  },
  status: "Current Stable Release",
  description:
    "The Ubuntu release that will be delivered in April 2026, designated 26.04.",
  links: {
    reportBug: "https://bugs.launchpad.net/ubuntu/+filebug",
    askQuestion: "https://answers.launchpad.net/ubuntu/+addquestion",
    translate: "https://translations.launchpad.net/ubuntu/resolute",
    subscribeToBugs: "https://bugs.launchpad.net/ubuntu/resolute/+subscribe",
    milestones: "https://launchpad.net/ubuntu/resolute/+milestones",
  },
  milestones: [
    {
      name: "ubuntu-26.04.1",
      date: "2026-08-27",
      url: "https://launchpad.net/ubuntu/+milestone/ubuntu-26.04.1",
    },
    {
      name: "ubuntu-26.04.2",
      date: "2027-02-18",
      url: "https://launchpad.net/ubuntu/+milestone/ubuntu-26.04.2",
    },
    {
      name: "resolute-updates",
      date: "2031-04-23",
      url: "https://launchpad.net/ubuntu/+milestone/resolute-updates",
    },
  ],
} satisfies Awaited<ReturnType<typeof getSeriesOverview>>;
