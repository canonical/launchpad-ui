import { MAINTAINERS } from "../maintainers.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const bash: SourcePackageSeed = {
  details: {
    id: "bash",
    name: "bash",
    description:
      "Bash is an sh-compatible command language interpreter that executes commands read from the standard input or from a file. Bash also incorporates useful features from the Korn and C shells (ksh and csh).\n\nBash is the default login shell on Ubuntu. It conforms to the IEEE POSIX P1003.2/ISO 9945.2 Shell and Tools standard while extending it with features such as command-line editing, job control, command history, brace expansion, integer arithmetic and process substitution.",
    maintainer: MAINTAINERS.matthiasKlose,
    urgency: "High",
    architectures: [
      "amd64",
      "arm64",
      "armhf",
      "i386",
      "ppc64el",
      "riscv64",
      "s390x",
    ],
    openBugCount: 31,
    openQuestionsCount: 1,
    changeLogCount: 287,
    changelogUrl: lp("/ubuntu/+source/bash/+changelog"),
    pendingUploads: 0,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "main",
    latestVersionId: "bash-5-3-7-1ubuntu1",
    seriesKey: "resolute",
  },
  latestVersion: "5.3.7-1ubuntu1",
  versions: [
    {
      version: "5.3.7-1ubuntu1",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "shells",
      uploadDateTime: "2026-04-01T07:00:00Z",
      uploader: "matthiasKlose",
      publishedOn: "2026-04-01",
      isCurrent: true,
    },
    {
      version: "5.2.21-2ubuntu4",
      series: "noble",
      status: "Published",
      pocket: "Security",
      component: "main",
      section: "shells",
      uploadDateTime: "2026-01-12T13:25:00Z",
      uploader: "matthiasKlose",
      publishedOn: "2026-01-12",
      isCurrent: true,
    },
  ],
  binaryPackageNames: ["bash", "bash-doc", "bash-builtins", "bash-static"],
  binariesGroup: {
    title: "bash binary packages",
    description:
      "Bourne-again shell — GNU Bash provides the default user shell on Ubuntu.",
    artifacts: [
      {
        id: "bash-resolute-amd64-release",
        name: "bash",
        version: "5.3.7-1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "bash-resolute-arm64-release",
        name: "bash",
        version: "5.3.7-1ubuntu1",
        architecture: "arm64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [{ name: "base-files" }, { name: "debianutils" }],
    recommends: [],
    suggests: [{ name: "bash-doc" }],
    conflicts: [],
    dependedBy: [
      { name: "bash-completion" },
      { name: "lsb-base" },
      { name: "ubuntu-minimal" },
    ],
    recommendedBy: [],
    suggestedBy: [],
  },
  ppaVersions: [],
  bugs: [
    {
      id: "2091445",
      title: "[[ ]] regex matching: locale-dependent failure",
      importance: "Medium",
      status: "Confirmed",
    },
  ],
  cves: [
    {
      id: "CVE-2026-04001",
      title: "Heap overflow in alias expansion",
      severity: "high",
      status: "released",
      publishedDate: "2026-01-20",
      affectedVersions: ["5.3.6-1"],
    },
  ],
  mergeProposals: [],
  upstream: {
    homepage: "https://www.gnu.org/software/bash/",
    repositoryUrl: "https://git.savannah.gnu.org/cgit/bash.git",
    bugTrackerUrl: "https://savannah.gnu.org/bugs/?group=bash",
    latestRelease: {
      version: "5.3.7",
      releasedAt: "2026-03-12",
      url: "https://lists.gnu.org/archive/html/bug-bash/2026-03/",
    },
    contacts: [{ name: "Chet Ramey", role: "upstream maintainer" }],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/bash",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=bash",
    latestDebianVersion: "5.3.7-2",
    latestDebianSeries: "trixie",
    openBugCount: 9,
  },
  source: {
    distribution: "ubuntu",
    packageName: "bash",
    url: lp("/ubuntu/+source/bash"),
  },
  versionUpstream: [
    {
      name: "GNU Bash",
      url: "https://www.gnu.org/software/bash/",
    },
  ],
};

