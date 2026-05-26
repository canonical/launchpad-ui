import { MAINTAINERS } from "../maintainers.js";
import { SERIES } from "../series.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const snapd: SourcePackageSeed = {
  details: {
    id: "snapd",
    name: "snapd",
    description:
      "Daemon and tooling that enable snap packages — snapd is the background service that manages and maintains your snaps, automatically updating them with the latest revisions from the Snap Store.\n\nsnapd provides confinement using AppArmor, seccomp, cgroups and namespaces; supports transactional updates with automatic rollback; and exposes the `snap` command-line tool for installing, refreshing, removing, and connecting interfaces between snaps. It is enabled by default on Ubuntu Server and Desktop.",
    maintainer: MAINTAINERS.iainLane,
    urgency: "Medium",
    architectures: ["amd64", "arm64", "armhf", "ppc64el", "riscv64", "s390x"],
    openBugCount: 64,
    openQuestionsCount: 9,
    changeLogCount: 297,
    changelogUrl: lp("/ubuntu/+source/snapd/+changelog"),
    pendingUploads: 1,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "main",
    latestVersionId: "snapd-2-65-3",
    seriesKey: "resolute",
  },
  latestVersion: "2.65.3+26.04",
  versions: [
    {
      version: "2.65.3+26.04",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "admin",
      uploadDateTime: "2026-05-02T11:00:00Z",
      uploader: "iainLane",
      publishedOn: "2026-05-02",
      isCurrent: true,
    },
    {
      version: "2.64.2+24.04",
      series: "noble",
      status: "Published",
      pocket: "Updates",
      component: "main",
      section: "admin",
      uploadDateTime: "2026-02-22T09:00:00Z",
      uploader: "iainLane",
      publishedOn: "2026-02-22",
      isCurrent: true,
    },
  ],
  binaryPackageNames: ["snapd", "snap-confine", "snapd-xdg-open"],
  binariesGroup: {
    title: "snapd binary packages",
    description:
      "Snap daemon and supporting binaries (confinement helper, xdg integration).",
    artifacts: [
      {
        id: "snapd-resolute-amd64-release",
        name: "snapd",
        version: "2.65.3+26.04",
        architecture: "amd64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [{ name: "squashfs-tools" }, { name: "apparmor" }],
    recommends: [{ name: "squashfuse" }],
    suggests: [],
    conflicts: [],
    dependedBy: [{ name: "ubuntu-core" }],
    recommendedBy: [{ name: "ubuntu-server" }],
    suggestedBy: [],
  },
  ppaVersions: [],
  bugs: [
    {
      id: "2081200",
      title: "Snap refresh hangs on slow storage",
      importance: "High",
      status: "Confirmed",
      series: SERIES.resolute,
    },
  ],
  cves: [],
  mergeProposals: [],
  upstream: {
    homepage: "https://snapcraft.io/",
    repositoryUrl: "https://github.com/canonical/snapd",
    bugTrackerUrl: "https://bugs.launchpad.net/snapd",
    latestRelease: {
      version: "2.65.3",
      releasedAt: "2026-04-30",
      url: "https://github.com/canonical/snapd/releases/tag/2.65.3",
    },
    contacts: [{ name: "Canonical Snap Team", role: "upstream" }],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/snapd",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=snapd",
    openBugCount: 5,
  },
  source: {
    distribution: "ubuntu",
    packageName: "snapd",
    url: lp("/ubuntu/+source/snapd"),
  },
  versionUpstream: [{ name: "snapd", url: "https://snapcraft.io/" }],
};

