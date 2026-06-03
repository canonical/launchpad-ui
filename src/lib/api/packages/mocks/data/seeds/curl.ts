import { MAINTAINERS } from "../maintainers.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const curl: SourcePackageSeed = {
  details: {
    id: "curl",
    name: "curl",
    description:
      "command-line tool for transferring data with URL syntax — curl supports DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMTP, SMTPS, TELNET and TFTP.\n\ncurl supports HTTPS certificates, HTTP POST, HTTP PUT, FTP uploading, HTTP form-based upload, proxies, cookies, user+password authentication, file transfer resume, proxy tunnelling and more. It is built on top of libcurl, which is also used by many other applications as their HTTP transfer layer.",
    maintainer: MAINTAINERS.omarFaruk,
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
    openBugCount: 16,
    openQuestionsCount: 4,
    changeLogCount: 219,
    changelogUrl: lp("/ubuntu/+source/curl/+changelog"),
    pendingUploads: 1,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "main",
    latestVersionId: "curl-8-12-1-1ubuntu1",
    seriesKey: "resolute",
  },
  latestVersion: "8.12.1-1ubuntu1",
  versions: [
    {
      version: "8.12.1-1ubuntu1",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "web",
      uploadDateTime: "2026-04-21T06:42:00Z",
      uploader: "omarFaruk",
      publishedOn: "2026-04-21",
      isCurrent: true,
    },
    {
      version: "8.5.0-2ubuntu10.5",
      series: "noble",
      status: "Published",
      pocket: "Security",
      component: "main",
      section: "web",
      uploadDateTime: "2026-04-21T07:00:00Z",
      uploader: "omarFaruk",
      publishedOn: "2026-04-21",
      isCurrent: true,
    },
  ],
  binaryPackageNames: ["curl", "libcurl4", "libcurl4-openssl-dev"],
  binariesGroup: {
    title: "curl binary packages",
    description:
      "Command-line tool + libcurl libraries with OpenSSL and developer headers.",
    artifacts: [
      {
        id: "curl-resolute-amd64-release",
        name: "curl",
        version: "8.12.1-1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "libcurl4-resolute-amd64-release",
        name: "libcurl4",
        version: "8.12.1-1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [{ name: "libcurl4", version: ">= 8.12.1-1ubuntu1" }],
    recommends: [{ name: "ca-certificates" }],
    suggests: [],
    conflicts: [],
    dependedBy: [{ name: "snapd" }, { name: "lsb-release" }],
    recommendedBy: [],
    suggestedBy: [],
  },
  ppaVersions: [],
  bugs: [],
  cves: [
    {
      id: "CVE-2026-30801",
      title: "Integer overflow in QUIC handler",
      severity: "high",
      status: "released",
      publishedDate: "2026-04-19",
      affectedVersions: ["8.12.0-1ubuntu1"],
    },
  ],
  mergeProposals: [],
  upstream: {
    homepage: "https://curl.se/",
    repositoryUrl: "https://github.com/curl/curl",
    bugTrackerUrl: "https://github.com/curl/curl/issues",
    latestRelease: {
      version: "8.12.1",
      releasedAt: "2026-04-15",
      url: "https://curl.se/changes.html#8_12_1",
    },
    contacts: [{ name: "Daniel Stenberg", role: "upstream maintainer" }],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/curl",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=curl",
    latestDebianVersion: "8.12.1-1",
    latestDebianSeries: "trixie",
    openBugCount: 11,
  },
  source: {
    distribution: "ubuntu",
    packageName: "curl",
    url: lp("/ubuntu/+source/curl"),
  },
  versionUpstream: [
    {
      name: "cURL",
      icon: "https://curl.se/favicon.ico",
      url: "https://curl.se/",
    },
  ],
};
