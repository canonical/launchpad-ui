import * as v from "valibot";

export type Collection<T> = {
  start: number;
  entries: T[];
  /** Present only when the request asks for it (`ws.show=total_size`). */
  total_size?: number;
  total_size_link?: string;
  next_collection_link?: string;
  previous_collection_link?: string;
};

const publishingStatusSchema = v.picklist([
  "Published",
  "Pending",
  "Superseded",
  "Deleted",
  "Obsolete",
]);
const pocketSchema = v.picklist([
  "Release",
  "Security",
  "Updates",
  "Proposed",
  "Backports",
]);
const countSchema = v.pipe(v.number(), v.safeInteger(), v.minValue(0));
const idSchema = v.pipe(v.number(), v.safeInteger(), v.minValue(1));

export type PublishingStatus = v.InferOutput<typeof publishingStatusSchema>;
export type Pocket = v.InferOutput<typeof pocketSchema>;

export const sourcePackageListSchema = v.object({
  total: countSchema,
  total_pages: countSchema,
  page: idSchema,
  page_size: v.pipe(idSchema, v.maxValue(100)),
  sources: v.array(
    v.object({
      id: idSchema,
      source_package_name: v.string(),
      source_package_version: v.string(),
      series: v.string(),
      pocket: pocketSchema,
      status: publishingStatusSchema,
      binaries: v.array(v.object({ name: v.string(), id: idSchema })),
      binaries_total: countSchema,
    }),
  ),
});

export const binaryPackageDetailsSchema = v.object({
  id: idSchema,
  binary_package_name: v.string(),
  binary_package_version: v.string(),
  summary: v.optional(v.string()),
  description: v.string(),
  files: v.array(
    v.object({
      filename: v.string(),
      size: countSchema,
      url: v.pipe(v.string(), v.url()),
    }),
  ),
});

export type SourcePackageList = v.InferOutput<typeof sourcePackageListSchema>;
export type SourcePackageListEntry = SourcePackageList["sources"][number];
export type BinaryPackageDetails = v.InferOutput<
  typeof binaryPackageDetailsSchema
>;

export type SourcePackageSortKey =
  | "date_published"
  | "date_created"
  | "source_package_name"
  | "series"
  | "pocket"
  | "status";

/** Null and undefined represent unset filters; empty name strings are also omitted. */
export type SourcePackageListFilter = {
  series?: string | null;
  statuses?: PublishingStatus[] | null;
  sourceName?: string | null;
  exactMatch?: boolean | null;
  pocket?: Pocket | null;
  maintainedBy?: string | null;
  signedBy?: string | null;
  ubuntuChange?: boolean | null;
};

export type PersonEntry = {
  self_link: string;
  resource_type_link: string;
  name: string;
  display_name: string;
  is_team: boolean;
  mugshot_link: string;
};

export type DistroSeriesEntry = {
  version: string;
  displayname: string;
  status: string;
  summary: string;
  web_link: string;
  translations_usage: string;
};

export type MilestoneEntry = {
  name: string;
  date_targeted: string | null;
  web_link: string;
};

export type SourcePackageListQuery = SourcePackageListFilter & {
  size?: number;
  page?: number;
  orderBy?: (SourcePackageSortKey | `-${SourcePackageSortKey}`)[];
};
