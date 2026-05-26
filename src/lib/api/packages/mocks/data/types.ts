import type {
  Architecture,
  Component,
  DebianTrackerLinks,
  ExternalLink,
  MergeProposal,
  PackageBug,
  PackageCve,
  PackageRelationships,
  PackageUploadItem,
  PackageUpstreamDetails,
  Pocket,
  PpaVersion,
  SourcePackageBinariesGroup,
  SourcePackageDetails,
  SourcePackageListItem,
  SourceTreeLink,
  VersionDetails,
  VersionPublishingInfo,
} from "../../types.js";
import type { MAINTAINERS } from "./maintainers.js";
import type { SeriesKey } from "./series.js";

export type SourcePackageSeed = {
  details: SourcePackageDetails;
  listing: {
    status: SourcePackageListItem["status"];
    pocket: Pocket;
    component: Component;
    latestVersionId: string;
    seriesKey: SeriesKey;
  };
  latestVersion: string;
  versions: Array<{
    version: string;
    series: SeriesKey;
    status: PackageUploadItem["status"];
    pocket: Pocket;
    component: Component;
    section: string;
    uploadDateTime: string;
    uploader: keyof typeof MAINTAINERS;
    publishedOn?: string;
    isCurrent?: boolean;
    builds?: Array<{
      name: Architecture;
      status: VersionPublishingInfo["builds"][number]["status"];
    }>;
  }>;
  binaryPackageNames: string[];
  binariesGroup: SourcePackageBinariesGroup;
  relationships: PackageRelationships;
  ppaVersions: PpaVersion[];
  bugs: PackageBug[];
  cves: PackageCve[];
  mergeProposals: MergeProposal[];
  upstream: PackageUpstreamDetails;
  debian: DebianTrackerLinks;
  source: SourceTreeLink;
  versionDetailsOverrides?: Partial<Record<string, Partial<VersionDetails>>>;
  versionUpstream: ExternalLink[];
};
