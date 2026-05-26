import type { BinaryPackageDetails } from "../../types.js";
import { SOURCE_PACKAGES } from "./seeds/index.js";
import { SERIES } from "./series.js";
import { dn } from "./shared.js";
import type { SourcePackageSeed } from "./types.js";

export type BinaryPackageSeed = {
  details: BinaryPackageDetails;
  sourceName: string;
};

const buildBinaryDetails = (
  source: SourcePackageSeed,
  binaryName: string,
): BinaryPackageSeed => {
  const latestVersion = source.latestVersion;
  const versionSlug = latestVersion.replace(/[^a-zA-Z0-9]+/g, "-");
  return {
    sourceName: source.details.name,
    details: {
      id: `${binaryName}-${versionSlug}`,
      name: binaryName,
      debPackage: {
        name: `${binaryName}_${latestVersion.replace(/^\d+:/, "")}_amd64.deb`,
        size: "14.1 MiB",
        url: dn(
          `/ubuntu/pool/main/${binaryName.charAt(0)}/${source.details.name}/${binaryName}_${latestVersion.replace(/^\d+:/, "")}_amd64.deb`,
        ),
      },
      version: latestVersion,
      status: "Published",
      pocket: source.listing.pocket,
      component: source.listing.component,
      priority: "Optional",
      build: `Build amd64 build of ${source.details.name} ${latestVersion} in ubuntu ${SERIES[source.listing.seriesKey].name}`,
      source: `${source.details.name} ${latestVersion} source package`,
      relationships: source.relationships,
    },
  };
};

export const BINARY_PACKAGES: Record<string, BinaryPackageSeed> = (() => {
  const out: Record<string, BinaryPackageSeed> = {};
  for (const sp of Object.values(SOURCE_PACKAGES)) {
    for (const name of sp.binaryPackageNames) {
      out[name] = buildBinaryDetails(sp, name);
    }
  }
  return out;
})();

export const findBinaryPackage = (
  name: string,
): BinaryPackageSeed | undefined => BINARY_PACKAGES[name];
