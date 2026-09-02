// AI-written types for the Launchpad webservice (lazr.restful over JSON).
// Subset covering `Archive.getPublishedSources`, which backs the packages
// listing page. Replace with generated types if an OpenAPI client lands.

/** Wraps every collection response (`ws.op=get*`). */
export type Collection<T> = {
  start: number;
  entries: T[];
  /** Present only when the request asks for it (`ws.show=total_size`). */
  total_size?: number;
  total_size_link?: string;
  next_collection_link?: string;
  previous_collection_link?: string;
};

export type PublishingStatus =
  | "Published"
  | "Pending"
  | "Superseded"
  | "Deleted"
  | "Obsolete";

export type Pocket =
  | "Release"
  | "Security"
  | "Updates"
  | "Proposed"
  | "Backports";

export type BinaryPackagePublishingEntry = {
  self_link: string;
  display_name: string;
  binary_package_name: string;
  binary_package_version: string;
  status: PublishingStatus;
  pocket: Pocket;
  component_name: string;
  distro_arch_series_link: string;
  source_package_name: string;
  source_package_version: string;
  date_published: string | null;
  architecture_specific: boolean;
};

export type PublishedBinariesQuery = {
  binaryName: string;
  size?: number;
};

export type BinaryFileMeta = {
  url: string;
  size: number;
  sha256?: string;
};

export type PublishedBinarySummary = {
  binary_package_name: string;
  architecture_tag: string;
  status: string;
  pocket: string;
  date_created: string | null;
  date_made_pending: string | null;
  date_superseded: string | null;
  date_removed: string | null;
  web_link: string;
  build_status: string;
  build_web_link: string;
};

/** `source_package_publishing_history` entry, as returned in collections. */
export type SourcePackagePublishingEntry = {
  self_link: string;
  resource_type_link: string;
  display_name: string;
  source_package_name: string;
  source_package_version: string;
  status: PublishingStatus;
  pocket: Pocket;
  component_name: string;
  section_name: string | null;
  distro_series_link: string;
  archive_link: string;
  date_published: string | null;
  date_created: string;
  date_superseded: string | null;
  date_made_pending: string | null;
  date_removed: string | null;
  published_binaries: PublishedBinarySummary[];
};

/** Sort keys accepted by `getPublishedSources`' `order_by`. */
export type PublishedSourcesSortKey =
  | "date_published"
  | "date_created"
  | "source_package_name"
  | "series"
  | "pocket"
  | "status";

export type PublishedSourcesQuery = {
  /** Page size (`ws.size`). */
  size?: number;
  /** Zero-based offset of the first entry (`ws.start`). */
  start?: number;
  /** Repeated `order_by` params; prefix with `-` for descending. */
  orderBy?: string[];
  /** Repeated `status` params. */
  status?: PublishingStatus[];
};
