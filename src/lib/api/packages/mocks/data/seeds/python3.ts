import { MAINTAINERS } from "../maintainers.js";
import { SERIES } from "../series.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const python3: SourcePackageSeed = {
  details: {
    id: "python3",
    name: "python3",
    description:
      "Interactive high-level object-oriented language (default python3 version). This package is a dependency package, which depends on Ubuntu's default Python 3 version (currently v3.13).\n\nPython is a clear and powerful general-purpose programming language with a syntax that emphasises readability, and a comprehensive standard library. It is used widely for scripting, automation, web back-ends, data science, machine learning, and system tooling across the Ubuntu ecosystem.",
    maintainer: MAINTAINERS.matthiasKlose,
    urgency: "Medium",
    architectures: [
      "amd64",
      "arm64",
      "armhf",
      "i386",
      "ppc64el",
      "riscv64",
      "s390x",
      "all",
    ],
    openBugCount: 87,
    openQuestionsCount: 12,
    changeLogCount: 411,
    changelogUrl: lp("/ubuntu/+source/python3/+changelog"),
    pendingUploads: 1,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "main",
    latestVersionId: "python3-3-13-2-1",
    seriesKey: "resolute",
  },
  latestVersion: "3.13.2-1",
  versions: [
    {
      version: "3.13.2-1",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "python",
      uploadDateTime: "2026-04-30T16:42:00Z",
      uploader: "matthiasKlose",
      publishedOn: "2026-04-30",
      isCurrent: true,
    },
    {
      version: "3.13.1-2",
      series: "resolute",
      status: "Superseded",
      pocket: "Release",
      component: "main",
      section: "python",
      uploadDateTime: "2026-03-08T11:00:00Z",
      uploader: "matthiasKlose",
    },
    {
      version: "3.12.7-1",
      series: "noble",
      status: "Published",
      pocket: "Updates",
      component: "main",
      section: "python",
      uploadDateTime: "2025-09-15T08:00:00Z",
      uploader: "matthiasKlose",
      publishedOn: "2025-09-15",
      isCurrent: true,
    },
  ],
  binaryPackageNames: [
    "python3",
    "python3-dev",
    "python3-minimal",
    "python3-doc",
    "libpython3-stdlib",
  ],
  binariesGroup: {
    title: "python3 binary packages",
    description:
      "Default Python 3 interpreter and supporting libraries built from the python3 source package.",
    artifacts: [
      {
        id: "python3-resolute-amd64-release",
        name: "python3",
        version: "3.13.2-1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "python3-dev-resolute-amd64-release",
        name: "python3-dev",
        version: "3.13.2-1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "python3-minimal-resolute-amd64-release",
        name: "python3-minimal",
        version: "3.13.2-1",
        architecture: "amd64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [{ name: "python3-minimal" }, { name: "libpython3-stdlib" }],
    recommends: [],
    suggests: [{ name: "python3-doc" }, { name: "python3-tk" }],
    conflicts: [],
    dependedBy: [
      { name: "apt" },
      { name: "ubuntu-minimal" },
      { name: "cloud-init" },
    ],
    recommendedBy: [{ name: "ubuntu-standard" }],
    suggestedBy: [],
  },
  ppaVersions: [
    {
      id: "deadsnakes-python3-13-2",
      version: "3.13.2-1~ppa1",
      ppa: {
        name: "Deadsnakes",
        img: "https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa/+icon",
        url: "https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa",
      },
      author: {
        id: "deadsnakes",
        name: "Deadsnakes",
        profileImage: "https://launchpad.net/~deadsnakes/+icon",
        url: "https://launchpad.net/~deadsnakes",
      },
    },
  ],
  bugs: [
    {
      id: "2094011",
      title: "ssl module: TLS 1.3 PSK handshake fails on s390x",
      importance: "High",
      status: "Triaged",
    },
    {
      id: "2093800",
      title: "venv: --prompt no longer escapes special characters",
      importance: "Medium",
      status: "Confirmed",
      series: SERIES.resolute,
    },
  ],
  cves: [
    {
      id: "CVE-2026-09111",
      title: "Integer overflow in zipfile decompression",
      severity: "medium",
      status: "released",
      publishedDate: "2026-02-21",
      affectedVersions: ["3.13.0-1"],
    },
  ],
  mergeProposals: [],
  upstream: {
    homepage: "https://www.python.org/",
    repositoryUrl: "https://github.com/python/cpython",
    bugTrackerUrl: "https://github.com/python/cpython/issues",
    latestRelease: {
      version: "3.13.2",
      releasedAt: "2026-04-15",
      url: "https://www.python.org/downloads/release/python-3132/",
    },
    contacts: [
      {
        name: "Python Steering Council",
        role: "upstream",
        url: "https://www.python.org/dev/peps/pep-0013/",
      },
    ],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/python3.13",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=python3.13",
    latestDebianVersion: "3.13.2-2",
    latestDebianSeries: "trixie",
    openBugCount: 38,
  },
  source: {
    distribution: "ubuntu",
    packageName: "python3",
    url: lp("/ubuntu/+source/python3"),
  },
  versionUpstream: [
    {
      name: "CPython",
      icon: "https://www.python.org/static/favicon.ico",
      url: "https://www.python.org/",
    },
  ],
};

