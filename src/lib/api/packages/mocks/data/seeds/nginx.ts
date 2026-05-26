import { MAINTAINERS } from "../maintainers.js";
import { SERIES } from "../series.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const nginx: SourcePackageSeed = {
  details: {
    id: "nginx",
    name: "nginx",
    description:
      "small, powerful, scalable web/proxy server — Nginx is a high-performance HTTP and reverse-proxy server with low memory usage and high concurrency.\n\nNginx serves static content directly, terminates TLS, load-balances upstream application servers, and proxies WebSocket and gRPC traffic. It is commonly deployed in front of dynamic frameworks (Django, Rails, Node.js) to handle connection pooling, request buffering and caching. Configuration is declarative and reloadable without dropping live connections.",
    maintainer: MAINTAINERS.iainLane,
    urgency: "Medium",
    architectures: ["amd64", "arm64", "armhf", "ppc64el", "riscv64", "s390x"],
    openBugCount: 42,
    openQuestionsCount: 5,
    changeLogCount: 138,
    changelogUrl: lp("/ubuntu/+source/nginx/+changelog"),
    pendingUploads: 0,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "universe",
    latestVersionId: "nginx-1-30-0-1ubuntu1",
    seriesKey: "resolute",
  },
  latestVersion: "1.30.0-1ubuntu1",
  versions: [
    {
      version: "1.30.0-1ubuntu1",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "universe",
      section: "httpd",
      uploadDateTime: "2026-05-04T18:33:00Z",
      uploader: "iainLane",
      publishedOn: "2026-05-04",
      isCurrent: true,
    },
    {
      version: "1.28.0-2ubuntu1",
      series: "noble",
      status: "Published",
      pocket: "Updates",
      component: "universe",
      section: "httpd",
      uploadDateTime: "2025-08-20T12:00:00Z",
      uploader: "iainLane",
      publishedOn: "2025-08-20",
      isCurrent: true,
    },
  ],
  binaryPackageNames: [
    "nginx",
    "nginx-core",
    "nginx-light",
    "nginx-full",
    "nginx-extras",
    "libnginx-mod-http-geoip2",
  ],
  binariesGroup: {
    title: "nginx binary packages",
    description:
      "Web/proxy server (metapackage). Pulls in nginx-core; users typically install nginx-full or nginx-extras for additional modules.",
    artifacts: [
      {
        id: "nginx-resolute-amd64-release",
        name: "nginx",
        version: "1.30.0-1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "nginx-full-resolute-amd64-release",
        name: "nginx-full",
        version: "1.30.0-1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [
      { name: "nginx-core", version: ">= 1.30.0-1ubuntu1" },
      { name: "lsb-base" },
    ],
    recommends: [{ name: "openssl" }],
    suggests: [
      { name: "nginx-doc" },
      { name: "fcgiwrap" },
      { name: "ssl-cert" },
    ],
    conflicts: [{ name: "apache2", version: "<< 2.4" }],
    dependedBy: [],
    recommendedBy: [],
    suggestedBy: [{ name: "ubuntu-server" }],
  },
  ppaVersions: [
    {
      id: "nginx-stable-1-30-0",
      version: "1.30.0-1ubuntu1~ppa1",
      ppa: {
        name: "Nginx Stable",
        img: "https://launchpad.net/~nginx/+archive/ubuntu/stable/+icon",
        url: "https://launchpad.net/~nginx/+archive/ubuntu/stable",
      },
      author: {
        id: "nginx-team",
        name: "Nginx Team",
        profileImage: "https://launchpad.net/~nginx/+icon",
        url: "https://launchpad.net/~nginx",
      },
    },
  ],
  bugs: [
    {
      id: "2088100",
      title: "HTTP/3 alt-svc header omitted with reuseport",
      importance: "High",
      status: "Triaged",
      series: SERIES.resolute,
    },
    {
      id: "2088091",
      title: "logrotate config double-rotates access.log",
      importance: "Low",
      status: "Confirmed",
    },
  ],
  cves: [
    {
      id: "CVE-2026-08501",
      title: "Off-by-one in HTTP/3 frame parser",
      severity: "high",
      status: "released",
      publishedDate: "2026-03-05",
      affectedVersions: ["1.29.0-1", "1.30.0~rc1-1"],
    },
  ],
  mergeProposals: [],
  upstream: {
    homepage: "https://nginx.org/",
    repositoryUrl: "https://github.com/nginx/nginx",
    bugTrackerUrl: "https://trac.nginx.org/nginx",
    latestRelease: {
      version: "1.30.0",
      releasedAt: "2026-04-22",
      url: "https://nginx.org/en/CHANGES",
    },
    contacts: [{ name: "F5 Inc.", role: "upstream sponsor" }],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/nginx",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=nginx",
    latestDebianVersion: "1.30.0-2",
    latestDebianSeries: "trixie",
    openBugCount: 22,
  },
  source: {
    distribution: "ubuntu",
    packageName: "nginx",
    url: lp("/ubuntu/+source/nginx"),
  },
  versionUpstream: [{ name: "Nginx", url: "https://nginx.org/" }],
};

