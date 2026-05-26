import type {
  Architecture,
  CurrentVersionItem,
  LatestVersionInfo,
  PackageUploadItem,
  SourcePackageListItem,
  VersionBinaryPackage,
  VersionBuildRequirements,
  VersionDetails,
  VersionPublishingInfo,
  VersionSourceFile,
} from "../../types.js";
import { BINARY_PACKAGES } from "./binary-packages.js";
import { MAINTAINERS } from "./maintainers.js";
import { SERIES } from "./series.js";
import { dn, lp } from "./shared.js";
import type { SourcePackageSeed } from "./types.js";

export const toListingItem = (
  seed: SourcePackageSeed,
): SourcePackageListItem => ({
  sourcePackage: {
    id: seed.details.id,
    name: seed.details.name,
    latestVersion: seed.latestVersion,
    latestVersionId: seed.listing.latestVersionId,
  },
  status: seed.listing.status,
  series: SERIES[seed.listing.seriesKey],
  pocket: seed.listing.pocket,
  component: seed.listing.component,
  binaryPackages: seed.binaryPackageNames.map((n) => ({
    id: BINARY_PACKAGES[n]?.details.id ?? n,
    name: n,
  })),
});

export const toUploadItem = (
  seed: SourcePackageSeed,
  v: SourcePackageSeed["versions"][number],
): PackageUploadItem => ({
  id: `${seed.details.id}-${v.version.replace(/[^a-zA-Z0-9]+/g, "-")}`,
  name: seed.details.name,
  version: v.version,
  status: v.status,
  series: SERIES[v.series],
  pocket: v.pocket,
  component: v.component,
  uploadDateTime: v.uploadDateTime,
  links: {
    updateExcuses: `https://people.canonical.com/~ubuntu-archive/proposed-migration/${SERIES[v.series].name}/update_excuses.html#${seed.details.name}`,
    autopkgtest: `https://autopkgtest.ubuntu.com/packages/${seed.details.name}/${SERIES[v.series].name}/amd64`,
  },
});

export const toCurrentVersionItem = (
  seed: SourcePackageSeed,
  v: SourcePackageSeed["versions"][number],
): CurrentVersionItem => ({
  id: `${seed.details.id}-${v.version.replace(/[^a-zA-Z0-9]+/g, "-")}-${v.series}`,
  series: SERIES[v.series],
  version: v.version,
  pocket: v.pocket,
  component: v.component,
  publishedOn: v.publishedOn ?? v.uploadDateTime.slice(0, 10),
});

export const toLatestVersion = (seed: SourcePackageSeed): LatestVersionInfo => {
  const v = seed.versions[0];
  const versionSlug = v.version.replace(/[^a-zA-Z0-9]+/g, "-");
  return {
    id: `${seed.details.id}-${versionSlug}`,
    version: v.version,
    downloadUrl: dn(
      `/ubuntu/pool/${seed.listing.component}/${seed.details.name.charAt(0)}/${seed.details.name}/${seed.details.name}_${v.version.replace(/^\d+:/, "")}_amd64.deb`,
    ),
    fileName: `${seed.details.name}_${v.version.replace(/^\d+:/, "")}_amd64.deb`,
    fileSize: "14.1 KiB",
    status: "Published",
    pocket: v.pocket,
    component: v.component,
    priority: "Optional",
    build: `Build amd64 build of ${seed.details.name} ${v.version} in ubuntu ${SERIES[v.series].name}`,
    source: `${seed.details.name} ${v.version} source package`,
  };
};

export const toVersionDetails = (
  seed: SourcePackageSeed,
  v: SourcePackageSeed["versions"][number],
): VersionDetails => ({
  id: `${seed.details.id}-${v.version.replace(/[^a-zA-Z0-9]+/g, "-")}`,
  version: v.version,
  changelog: `${seed.details.name} (${v.version}) ${SERIES[v.series].name}; urgency=${seed.details.urgency.toLowerCase()}\n\n  * New upstream release.\n  * Refresh patches.\n  * debian/rules: tidy up build flags.\n\n -- ${MAINTAINERS[v.uploader].name} <${MAINTAINERS[v.uploader].id}@ubuntu.com>  ${v.uploadDateTime}`,
  changes: [
    {
      url: `https://launchpad.net/ubuntu/+source/${seed.details.name}/${v.version}/+files/${seed.details.name}_${v.version.replace(/^\d+:/, "")}.diff.gz`,
      name: `diff from previous to ${v.version}`,
    },
  ],
  uploader: MAINTAINERS[v.uploader],
  uploadDate: v.uploadDateTime,
  uploadDestination: `${SERIES[v.series].version} ${SERIES[v.series].displayName}`,
  originalMaintainer: seed.details.maintainer,
  section: v.section,
  urgency: seed.details.urgency,
  architectures: seed.details.architectures,
});

export const toVersionPublishing = (
  seed: SourcePackageSeed,
  v: SourcePackageSeed["versions"][number],
): VersionPublishingInfo => ({
  status:
    v.status === "Published" || v.status === "Superseded"
      ? (v.status as VersionPublishingInfo["status"])
      : "Pending",
  publishDate: v.uploadDateTime,
  series: SERIES[v.series],
  pocket: v.pocket,
  component: v.component,
  section: v.section,
  builds: (
    v.builds ??
    seed.details.architectures
      .filter((a) => a !== "all")
      .map((a) => ({ name: a as Architecture, status: "success" as const }))
  ).map((b) => ({
    name: b.name,
    status: b.status,
    url: `https://launchpad.net/ubuntu/+source/${seed.details.name}/${v.version}/+build/${b.name}`,
  })),
  links: {
    updateExcuses: `https://people.canonical.com/~ubuntu-archive/proposed-migration/${SERIES[v.series].name}/update_excuses.html#${seed.details.name}`,
    autopkgtest: `https://autopkgtest.ubuntu.com/packages/${seed.details.name}/${SERIES[v.series].name}/amd64`,
  },
});

export const toVersionSourceFiles = (
  seed: SourcePackageSeed,
  v: SourcePackageSeed["versions"][number],
): VersionSourceFile[] => {
  const base = `${seed.details.name}_${v.version.replace(/^\d+:/, "")}`;
  return [
    {
      fileName: `${base}.dsc`,
      downloadUrl: dn(
        `/ubuntu/pool/${v.component}/${seed.details.name.charAt(0)}/${seed.details.name}/${base}.dsc`,
      ),
      fileSize: "5.8 KiB",
      shaChecksum:
        "sha256:1d56cf7e6d4d6b87b78d59b3ef0a6dd6e1c0c4f9d1a2b3c4d5e6f7081929aabb",
    },
    {
      fileName: `${base}.orig.tar.xz`,
      downloadUrl: dn(
        `/ubuntu/pool/${v.component}/${seed.details.name.charAt(0)}/${seed.details.name}/${base}.orig.tar.xz`,
      ),
      fileSize: "54.7 MiB",
      shaChecksum:
        "sha256:abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    },
    {
      fileName: `${base}.debian.tar.xz`,
      downloadUrl: dn(
        `/ubuntu/pool/${v.component}/${seed.details.name.charAt(0)}/${seed.details.name}/${base}.debian.tar.xz`,
      ),
      fileSize: "212 KiB",
      shaChecksum:
        "sha256:0011223344556677889900aabbccddeeff00112233445566778899aabbccddee",
    },
  ];
};

export const toVersionBinaryPackages = (
  seed: SourcePackageSeed,
): VersionBinaryPackage[] =>
  seed.binaryPackageNames.map((name) => ({
    id: BINARY_PACKAGES[name]?.details.id ?? name,
    name,
    url: lp(`/ubuntu/+source/${seed.details.name}/+package/${name}`),
    description:
      BINARY_PACKAGES[name]?.details.source ??
      `binary package built from ${seed.details.name}`,
    architectures: seed.details.architectures
      .filter((a) => a !== "all")
      .map((a) => ({ name: a, id: `${name}-${a}` })),
    downloadUrl: BINARY_PACKAGES[name]?.details.debPackage.url ?? "",
  }));

export const toVersionBuildRequirements = (
  seed: SourcePackageSeed,
): VersionBuildRequirements => ({
  dependencies: {
    buildDepends: [
      { name: "debhelper", version: ">= 13" },
      { name: "dpkg-dev", version: ">= 1.22.5" },
      { name: "pkgconf" },
    ],
    buildDependsIndep:
      seed.details.name === "libreoffice"
        ? [{ name: "ant" }, { name: "junit4" }, { name: "apparmor" }]
        : [],
    buildDependsArch: seed.details.architectures
      .filter((a) => a === "amd64")
      .map(() => ({ name: "clang" })),
  },
  conflicts: {
    buildConflicts:
      seed.details.name === "libreoffice" ? [{ name: "nvidia-glx-dev" }] : [],
    buildConflictsIndep: [],
  },
});
