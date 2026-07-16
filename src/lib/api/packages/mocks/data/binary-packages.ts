import type { Architecture, BinaryPackageDetails } from "../../types.js";
import { SOURCE_PACKAGES } from "./seeds/index.js";
import { dn, stripEpoch, versionSlug } from "./shared.js";
import type { SourcePackageSeed } from "./types.js";

export type BinaryPackageSeed = {
  details: BinaryPackageDetails;
  sourceName: string;
};

const artifactSizes = {
  amd64: 45_773,
  arm64: 68_403,
  armhf: 43_315,
  ppc64el: 46_592,
  riscv64: 58_470,
  s390x: 64_410,
  i386: 43_315,
  all: 14_438,
} as const satisfies Record<Architecture, number>;

const buildArtifacts = (
  source: SourcePackageSeed,
  binaryName: string,
): BinaryPackageDetails["artifacts"] => {
  const version = stripEpoch(source.latestVersion);

  return source.details.architectures.map((architecture) => {
    const fileName = `${binaryName}_${version}_${architecture}.deb`;
    return {
      id: `${binaryName}-${versionSlug(source.latestVersion)}-${architecture}`,
      architecture,
      fileName,
      size: artifactSizes[architecture] ?? 14_438,
      url: dn(
        `/ubuntu/pool/${source.listing.component}/${binaryName.charAt(0)}/${source.details.name}/${fileName}`,
      ),
    };
  });
};

const buildBinaryDetails = (
  source: SourcePackageSeed,
  binaryName: string,
): BinaryPackageSeed => {
  return {
    sourceName: source.details.name,
    details: {
      id: `${binaryName}-${versionSlug(source.latestVersion)}`,
      title: source.binariesGroup.title,
      name: binaryName,
      summary: `${binaryName} binary package`,
      description: source.binariesGroup.description,
      downloadUrl: dn(
        `/ubuntu/pool/${source.listing.component}/${binaryName.charAt(0)}/${source.details.name}/${binaryName}_${stripEpoch(source.latestVersion)}_all.tar`,
      ),
      artifacts: buildArtifacts(source, binaryName),
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
