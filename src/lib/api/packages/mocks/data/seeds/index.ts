import type { Architecture, SourcePackageBinariesGroup } from "../../../types.js";
import { SERIES } from "../series.js";
import type { SourcePackageSeed } from "../types.js";
import { a11yProfileManager } from "./a11y-profile-manager.js";
import { bash } from "./bash.js";
import { curl } from "./curl.js";
import { EXTRA_SPECS, makeExtraSeed } from "./extras.js";
import { firefox } from "./firefox.js";
import { libreoffice } from "./libreoffice.js";
import { nginx } from "./nginx.js";
import { postgresql } from "./postgresql.js";
import { python3 } from "./python3.js";
import { snapd } from "./snapd.js";
import { vim } from "./vim.js";

// Every binary in `binaryPackageNames` must have a matching artifact in
// `binariesGroup.artifacts`. Fills any gap with a single amd64 Published
// entry. Idempotent.
const withArtifactsCoverage = (seed: SourcePackageSeed): SourcePackageSeed => {
  const covered = new Set(seed.binariesGroup.artifacts.map((a) => a.name));
  const missing = seed.binaryPackageNames.filter((n) => !covered.has(n));
  if (missing.length === 0) return seed;

  const arches = seed.details.architectures;
  const fillerArch: Architecture = arches.includes("amd64")
    ? "amd64"
    : (arches[0] ?? "amd64");
  const seriesName = SERIES[seed.listing.seriesKey].name;
  const pocketSlug = seed.listing.pocket.toLowerCase();

  const filler: SourcePackageBinariesGroup["artifacts"] = missing.map(
    (name) => ({
      id: `${name}-${seriesName}-${fillerArch}-${pocketSlug}`,
      name,
      version: seed.latestVersion,
      architecture: fillerArch,
      status: "Published",
    }),
  );

  return {
    ...seed,
    binariesGroup: {
      ...seed.binariesGroup,
      artifacts: [...seed.binariesGroup.artifacts, ...filler],
    },
  };
};

// First 3 hero seeds satisfy `filter.scope=my` (size 3 in the listing
// handler) — do not reorder without updating the test that asserts
// `data.total === 3` for `filter.scope=my`.
const RAW_SOURCE_PACKAGES: Record<string, SourcePackageSeed> = {
  libreoffice,
  "a11y-profile-manager": a11yProfileManager,
  python3,
  bash,
  nginx,
  firefox,
  postgresql,
  vim,
  curl,
  snapd,
  ...Object.fromEntries(
    EXTRA_SPECS.map((spec) => [spec.name, makeExtraSeed(spec)]),
  ),
};

export const SOURCE_PACKAGES: Record<string, SourcePackageSeed> =
  Object.fromEntries(
    Object.entries(RAW_SOURCE_PACKAGES).map(([key, seed]) => [
      key,
      withArtifactsCoverage(seed),
    ]),
  );

export const SOURCE_PACKAGE_NAMES = Object.keys(SOURCE_PACKAGES);

export const findSourcePackage = (
  name: string,
): SourcePackageSeed | undefined => SOURCE_PACKAGES[name];

export const findVersion = (
  seed: SourcePackageSeed,
  version: string,
): SourcePackageSeed["versions"][number] | undefined =>
  seed.versions.find((v) => v.version === version);
