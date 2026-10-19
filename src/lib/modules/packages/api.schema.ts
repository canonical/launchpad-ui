import * as v from "valibot";

// Temporary UI response schemas for getSourcePackageList and getBinaryPackageDetails.
// Their WADL omits return schemas, so the generated client outputs remain unknown.
// Remove these fallbacks once upstream OpenAPI provides the response contracts.
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
