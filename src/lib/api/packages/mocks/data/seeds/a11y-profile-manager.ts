import { MAINTAINERS } from "../maintainers.js";
import { SERIES } from "../series.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const a11yProfileManager: SourcePackageSeed = {
  details: {
    id: "a11y-profile-manager",
    name: "a11y-profile-manager",
    description:
      "Accessibility profiles manager for Ubuntu — switches assistive technology configurations as a group, so users can quickly opt into preset accessibility stacks.\n\nThe profile manager bundles screen readers, magnifiers, on-screen keyboards, and high-contrast theme switches behind a single GNOME indicator. Profiles can be defined per-user and shared system-wide, making it suitable for shared lab machines and kiosks as well as personal desktops.",
    maintainer: MAINTAINERS.ubuntuDevelopers,
    urgency: "Low",
    architectures: ["amd64", "arm64", "all"],
    openBugCount: 4,
    openQuestionsCount: 0,
    changeLogCount: 22,
    changelogUrl: lp("/ubuntu/+source/a11y-profile-manager/+changelog"),
    pendingUploads: 0,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "main",
    latestVersionId: "a11y-profile-manager-0-1-12-1",
    seriesKey: "resolute",
  },
  latestVersion: "0.1.12-1",
  versions: [
    {
      version: "0.1.12-1",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "utils",
      uploadDateTime: "2026-02-02T10:00:00Z",
      uploader: "martinPitt",
      publishedOn: "2026-02-02",
      isCurrent: true,
      builds: [
        { name: "amd64", status: "success" },
        { name: "arm64", status: "success" },
      ],
    },
    {
      version: "0.1.11-1",
      series: "noble",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "utils",
      uploadDateTime: "2024-03-15T09:00:00Z",
      uploader: "martinPitt",
      publishedOn: "2024-03-15",
      isCurrent: true,
    },
  ],
  binaryPackageNames: [
    "a11y-profile-manager",
    "a11y-profile-manager-indicator",
    "liba11y-profile-manager-0.1-0",
    "liba11y-profile-manager-dev",
    "a11y-profile-manager-doc",
  ],
  binariesGroup: {
    title: "a11y-profile-manager binary packages",
    description:
      "Accessibility profile manager — set of binaries providing the CLI, indicator, library, dev headers, and documentation.",
    artifacts: [
      {
        id: "a11y-profile-manager-resolute-amd64-release",
        name: "a11y-profile-manager",
        version: "0.1.12-1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "a11y-profile-manager-indicator-resolute-amd64-release",
        name: "a11y-profile-manager-indicator",
        version: "0.1.12-1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "liba11y-profile-manager-0-1-0-resolute-amd64-release",
        name: "liba11y-profile-manager-0.1-0",
        version: "0.1.12-1",
        architecture: "amd64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [
      { name: "libglib2.0-0", version: ">= 2.78" },
      { name: "libgtk-3-0" },
    ],
    recommends: [{ name: "orca" }, { name: "onboard" }],
    suggests: [{ name: "speech-dispatcher" }],
    conflicts: [],
    dependedBy: [{ name: "ubuntu-accessibility" }],
    recommendedBy: [],
    suggestedBy: [],
  },
  ppaVersions: [],
  bugs: [
    {
      id: "2095001",
      title: "Indicator does not refresh after profile switch",
      importance: "Medium",
      status: "Confirmed",
      series: SERIES.resolute,
    },
    {
      id: "2092200",
      title: "CLI: --list output is not localized",
      importance: "Low",
      status: "Triaged",
    },
  ],
  cves: [],
  mergeProposals: [
    {
      id: "mp-a11y-profile-manager-001",
      title: "Migrate to GTK 4",
      url: "https://code.launchpad.net/~accessibility-team/a11y-profile-manager/+git/a11y-profile-manager/+merge/438800",
      status: "Work in progress",
      registrant: MAINTAINERS.martinPitt,
      createdAt: "2026-03-04T12:00:00Z",
    },
  ],
  upstream: {
    homepage: "https://launchpad.net/a11y-profile-manager",
    repositoryUrl: "https://git.launchpad.net/a11y-profile-manager",
    bugTrackerUrl: "https://bugs.launchpad.net/a11y-profile-manager",
    contacts: [{ name: "Ubuntu Accessibility Team", role: "maintainer" }],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/a11y-profile-manager",
    btsUrl:
      "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=a11y-profile-manager",
    openBugCount: 6,
  },
  source: {
    distribution: "ubuntu",
    packageName: "a11y-profile-manager",
    url: lp("/ubuntu/+source/a11y-profile-manager"),
  },
  versionUpstream: [
    {
      name: "Launchpad project",
      url: "https://launchpad.net/a11y-profile-manager",
    },
  ],
};

