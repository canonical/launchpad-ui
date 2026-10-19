import type { LaunchpadCollection } from "@canonical/launchpad-client";
import type { DistroSeriesFull } from "@canonical/launchpad-client/schemas/models/distro_series";
import type { MilestoneFull } from "@canonical/launchpad-client/schemas/models/milestone";
import type { SeriesGroups } from "../packages/filters/types.js";
import type { getSeriesOverview } from "./series.remote.js";

export const distroSeries = {
  name: "resolute",
  version: "26.04",
  displayname: "Resolute",
  status: "Current Stable Release",
  summary:
    "The Ubuntu release that will be delivered in April 2026, designated 26.04.",
  web_link: "https://launchpad.net/ubuntu/resolute",
  translations_usage: "Launchpad",
} satisfies Partial<DistroSeriesFull>;

export const distroSeriesCollection = {
  start: 0,
  total_size: 5,
  entries: [
    {
      ...distroSeries,
      name: "stonking",
      version: "26.10",
      displayname: "Stonking",
      status: "Pre-release Freeze",
      web_link: "https://launchpad.net/ubuntu/stonking",
    },
    distroSeries,
    {
      ...distroSeries,
      name: "questing",
      version: "25.10",
      displayname: "Questing",
      status: "Obsolete",
      web_link: "https://launchpad.net/ubuntu/questing",
    },
    {
      ...distroSeries,
      name: "noble",
      version: "24.04",
      displayname: "Noble",
      status: "Supported",
      web_link: "https://launchpad.net/ubuntu/noble",
    },
    {
      ...distroSeries,
      name: "jammy",
      version: "22.04",
      displayname: "Jammy",
      status: "Supported",
      web_link: "https://launchpad.net/ubuntu/jammy",
    },
  ],
} satisfies LaunchpadCollection<Partial<DistroSeriesFull>>;

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
} satisfies LaunchpadCollection<Partial<MilestoneFull>>;

export const seriesOverview = {
  displayName: "26.04 LTS Resolute",
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

export const seriesGroups = [
  {
    status: "Pre-release Freeze",
    series: [{ name: "stonking", displayName: "26.10 Stonking" }],
  },
  {
    status: "Current Stable Release",
    series: [{ name: "resolute", displayName: "26.04 LTS Resolute" }],
  },
  {
    status: "Supported",
    series: [
      { name: "noble", displayName: "24.04 LTS Noble" },
      { name: "jammy", displayName: "22.04 LTS Jammy" },
    ],
  },
] satisfies SeriesGroups;
