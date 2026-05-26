import type {
  Architecture,
  PublishingStatus,
  SourcePackageBinariesGroup,
} from "../../../types.js";
import { MAINTAINERS } from "../maintainers.js";
import { SERIES } from "../series.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

// model real Ubuntu's Mozilla packaging (one .deb per locale) so the side
// panel artifacts list exercises rich-but-uniform fixture data.

const FIREFOX_VERSION = "138.0+build1-0ubuntu1";
const FIREFOX_RESOLUTE_ARCHES: Architecture[] = [
  "amd64",
  "arm64",
  "armhf",
  "s390x",
];

const FIREFOX_BINARIES: string[] = [
  "firefox",
  "firefox-dev",
  "firefox-mozsymbols",
  "firefox-geckodriver",
  "firefox-locale-en",
  "firefox-locale-de",
  "firefox-locale-fr",
  "firefox-locale-es",
  "firefox-locale-it",
  "firefox-locale-pt-br",
  "firefox-locale-ja",
  "firefox-locale-zh-cn",
  "firefox-locale-ru",
  "firefox-locale-ar",
  "firefox-locale-hi",
  "firefox-locale-nl",
  "firefox-locale-pl",
  "firefox-locale-ko",
];

const FIREFOX_ARTIFACTS: SourcePackageBinariesGroup["artifacts"] =
  FIREFOX_BINARIES.flatMap((binaryName) =>
    FIREFOX_RESOLUTE_ARCHES.map((arch) => ({
      id: `${binaryName}-resolute-${arch}-release`,
      name: binaryName,
      version: FIREFOX_VERSION,
      architecture: arch,
      status: "Published" as PublishingStatus,
    })),
  );

export const firefox: SourcePackageSeed = {
  details: {
    id: "firefox",
    name: "firefox",
    description:
      "Mozilla Firefox web browser — a fast, secure, and open-source web browser. Firefox provides a familiar user environment and a large library of extensions and themes.\n\nFirefox is developed by Mozilla and the global community of contributors. It supports modern web standards, sandboxed multi-process tabs, hardware-accelerated graphics, picture-in-picture video, container tabs, and built-in tracking protection. The Ubuntu package ships the standard release channel; ESR and Developer Edition are available separately.",
    maintainer: MAINTAINERS.sebastienBacher,
    urgency: "High",
    architectures: FIREFOX_RESOLUTE_ARCHES,
    openBugCount: 318,
    openQuestionsCount: 27,
    changeLogCount: 902,
    changelogUrl: lp("/ubuntu/+source/firefox/+changelog"),
    pendingUploads: 2,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "universe",
    latestVersionId: "firefox-138-0-build1",
    seriesKey: "resolute",
  },
  latestVersion: FIREFOX_VERSION,
  versions: [
    {
      version: FIREFOX_VERSION,
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "universe",
      section: "web",
      uploadDateTime: "2026-05-06T22:14:08Z",
      uploader: "sebastienBacher",
      publishedOn: "2026-05-06",
      isCurrent: true,
      builds: FIREFOX_RESOLUTE_ARCHES.map((name) => ({
        name,
        status: "success" as const,
      })),
    },
    {
      version: "137.0+build2-0ubuntu1",
      series: "resolute",
      status: "Superseded",
      pocket: "Release",
      component: "universe",
      section: "web",
      uploadDateTime: "2026-04-08T09:00:00Z",
      uploader: "sebastienBacher",
    },
    {
      version: "128.10.0esr+build1-0ubuntu0.24.04.1",
      series: "noble",
      status: "Published",
      pocket: "Security",
      component: "universe",
      section: "web",
      uploadDateTime: "2026-05-06T22:30:00Z",
      uploader: "sebastienBacher",
      publishedOn: "2026-05-06",
      isCurrent: true,
    },
  ],
  binaryPackageNames: FIREFOX_BINARIES,
  binariesGroup: {
    title: "firefox binary packages",
    description:
      "Mozilla Firefox web browser — main browser binary, dev symbols, geckodriver, and per-locale language packs. Each binary is published per architecture (amd64, arm64, armhf, s390x).",
    artifacts: FIREFOX_ARTIFACTS,
  },
  relationships: {
    dependedOn: [{ name: "libc6", version: ">= 2.39" }, { name: "libgtk-3-0" }],
    recommends: [{ name: "fonts-liberation" }, { name: "libcanberra0" }],
    suggests: [{ name: "libgssapi-krb5-2" }],
    conflicts: [{ name: "iceweasel" }],
    dependedBy: [],
    recommendedBy: [{ name: "ubuntu-desktop" }],
    suggestedBy: [],
  },
  ppaVersions: [
    {
      id: "mozillateam-firefox-138-0",
      version: "138.0+build1-0ubuntu0.26.04.1~ppa1",
      ppa: {
        name: "Mozilla Team",
        img: "https://launchpad.net/~mozillateam/+archive/ubuntu/ppa/+icon",
        url: "https://launchpad.net/~mozillateam/+archive/ubuntu/ppa",
      },
      author: {
        id: "mozillateam",
        name: "Mozilla Team",
        profileImage: "https://launchpad.net/~mozillateam/+icon",
        url: "https://launchpad.net/~mozillateam",
      },
    },
  ],
  bugs: [
    {
      id: "2089333",
      title: "Wayland: drag from address bar to file manager fails",
      importance: "Medium",
      status: "Triaged",
      series: SERIES.resolute,
    },
  ],
  cves: [
    {
      id: "CVE-2026-25001",
      title: "Sandbox escape via WebGL",
      severity: "critical",
      status: "released",
      publishedDate: "2026-05-05",
      affectedVersions: ["137.0+build2-0ubuntu1"],
    },
    {
      id: "CVE-2026-25002",
      title: "Memory corruption in JS engine",
      severity: "high",
      status: "released",
      publishedDate: "2026-05-05",
      affectedVersions: ["137.0+build2-0ubuntu1"],
    },
  ],
  mergeProposals: [],
  upstream: {
    homepage: "https://www.mozilla.org/firefox/",
    repositoryUrl: "https://hg.mozilla.org/mozilla-central/",
    bugTrackerUrl: "https://bugzilla.mozilla.org/",
    latestRelease: {
      version: "138.0",
      releasedAt: "2026-05-05",
      url: "https://www.mozilla.org/firefox/138.0/releasenotes/",
    },
    contacts: [{ name: "Mozilla Foundation", role: "upstream" }],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/firefox",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=firefox",
    latestDebianVersion: "138.0-1",
    latestDebianSeries: "trixie",
    openBugCount: 71,
  },
  source: {
    distribution: "ubuntu",
    packageName: "firefox",
    url: lp("/ubuntu/+source/firefox"),
  },
  versionUpstream: [
    {
      name: "Mozilla Firefox",
      icon: "https://www.mozilla.org/favicon.ico",
      url: "https://www.mozilla.org/firefox/",
    },
  ],
};

