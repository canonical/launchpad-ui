import type {
  Pocket,
  PublishingStatus,
  SourcePackagePublishingEntry,
} from "./types.js";

export type SourcePackageListRow = {
  sourcePackage: {
    id: string;
    name: string;
    latestVersion: string;
  };
  status: PublishingStatus;
  series: {
    name: string;
    displayName: string;
  };
  pocket: Pocket;
  component: string;
  binaryPackages: Array<{
    name: string;
  }>;
};

export function toSourcePackageListRow(
  entry: SourcePackagePublishingEntry,
): SourcePackageListRow {
  const seriesName = entry.distro_series_link.split("/").pop() ?? "";

  const binaryNames = new Set<string>();

  for (const binaryArchitecture of entry.published_binaries) {
    binaryNames.add(binaryArchitecture.binary_package_name);
  }

  return {
    sourcePackage: {
      id: entry.self_link,
      name: entry.source_package_name,
      latestVersion: entry.source_package_version,
    },
    status: entry.status,
    series: { name: seriesName, displayName: capitalize(seriesName) },
    pocket: entry.pocket,
    component: entry.component_name,
    binaryPackages: [...binaryNames].map((name) => ({ name })),
  };
}

function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}
