import { MAINTAINERS } from "../maintainers.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const postgresql: SourcePackageSeed = {
  details: {
    id: "postgresql",
    name: "postgresql",
    description:
      "Object-relational SQL database (metapackage depending on the default PostgreSQL version). This metapackage always depends on the currently supported PostgreSQL database server version.\n\nPostgreSQL is a powerful open-source relational database with a strong reputation for reliability, feature robustness, and correctness. It supports SQL:2016 conformance, multi-version concurrency control, foreign data wrappers, JSON/JSONB, full-text search, partitioning, logical replication, and a wide range of extensions including PostGIS for geospatial data.",
    maintainer: MAINTAINERS.martinPitt,
    urgency: "Medium",
    architectures: ["amd64", "arm64", "armhf", "ppc64el", "riscv64", "s390x"],
    openBugCount: 18,
    openQuestionsCount: 3,
    changeLogCount: 76,
    changelogUrl: lp("/ubuntu/+source/postgresql/+changelog"),
    pendingUploads: 0,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "main",
    latestVersionId: "postgresql-18-1-1ubuntu1",
    seriesKey: "resolute",
  },
  latestVersion: "18+1ubuntu1",
  versions: [
    {
      version: "18+1ubuntu1",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "database",
      uploadDateTime: "2026-04-12T10:00:00Z",
      uploader: "martinPitt",
      publishedOn: "2026-04-12",
      isCurrent: true,
    },
    {
      version: "16+251ubuntu1",
      series: "noble",
      status: "Published",
      pocket: "Updates",
      component: "main",
      section: "database",
      uploadDateTime: "2025-11-01T08:00:00Z",
      uploader: "martinPitt",
      publishedOn: "2025-11-01",
      isCurrent: true,
    },
  ],
  binaryPackageNames: [
    "postgresql",
    "postgresql-18",
    "postgresql-client",
    "postgresql-contrib",
    "postgresql-doc",
  ],
  binariesGroup: {
    title: "postgresql binary packages",
    description:
      "PostgreSQL metapackage. Installs the default-supported postgresql server and client.",
    artifacts: [
      {
        id: "postgresql-resolute-amd64-release",
        name: "postgresql",
        version: "18+1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "postgresql-client-resolute-amd64-release",
        name: "postgresql-client",
        version: "18+1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [{ name: "postgresql-18", version: ">= 18+1ubuntu1" }],
    recommends: [{ name: "postgresql-contrib" }],
    suggests: [{ name: "postgresql-doc" }],
    conflicts: [],
    dependedBy: [{ name: "postgresql-all" }],
    recommendedBy: [],
    suggestedBy: [{ name: "gitlab" }],
  },
  ppaVersions: [
    {
      id: "pgapt-postgresql-18",
      version: "18+1.pgdg26.04+1",
      ppa: {
        name: "PostgreSQL Apt Repository",
        img: "https://www.postgresql.org/favicon.ico",
        url: "https://apt.postgresql.org/",
      },
      author: {
        id: "pgdg",
        name: "PostgreSQL Global Development Group",
        profileImage: "https://www.postgresql.org/favicon.ico",
        url: "https://www.postgresql.org/community/",
      },
    },
  ],
  bugs: [
    {
      id: "2086500",
      title: "pg_upgrade fails to copy roles when --link is used",
      importance: "High",
      status: "Confirmed",
    },
  ],
  cves: [],
  mergeProposals: [],
  upstream: {
    homepage: "https://www.postgresql.org/",
    repositoryUrl: "https://git.postgresql.org/gitweb/?p=postgresql.git",
    bugTrackerUrl: "https://www.postgresql.org/account/submitbug/",
    latestRelease: {
      version: "18.0",
      releasedAt: "2026-03-30",
      url: "https://www.postgresql.org/about/news/postgresql-180-released/",
    },
    contacts: [
      { name: "PostgreSQL Global Development Group", role: "upstream" },
    ],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/postgresql-18",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=postgresql-18",
    latestDebianVersion: "18+1",
    latestDebianSeries: "trixie",
    openBugCount: 14,
  },
  source: {
    distribution: "ubuntu",
    packageName: "postgresql",
    url: lp("/ubuntu/+source/postgresql"),
  },
  versionUpstream: [
    {
      name: "PostgreSQL",
      icon: "https://www.postgresql.org/favicon.ico",
      url: "https://www.postgresql.org/",
    },
  ],
};

