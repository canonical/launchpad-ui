import * as v from "valibot";
import type { NOT_DEFINED } from "#lib/modules/distroseries/constants.js";
import type {
  BuildStatus,
  Product,
  TestStatus,
} from "#lib/modules/distroseries/images/types.js";

export type ImageArtifact = {
  id: number;
  name: string;
  os: string;
  release: string;
  stage: string;
  status: string;
  version: string;
  image_url: string;
  bug_link: string;
  all_environment_reviews_count: number;
  completed_environment_reviews_count: number;
  archived: boolean;
  created_at: string;
};

export const imageArtifactSchema = v.object({
  id: v.number(),
  name: v.string(),
  os: v.string(),
  release: v.string(),
  stage: v.string(),
  status: v.string(),
  version: v.string(),
  image_url: v.string(),
  bug_link: v.string(),
  all_environment_reviews_count: v.number(),
  completed_environment_reviews_count: v.number(),
  archived: v.boolean(),
  created_at: v.string(),
});

export type ImagesFilter = {
  product?: string | null;
  buildStatus?: BuildStatus | null;
  testStatus?: TestStatus | null;
};

export type ImagesQuery = ImagesFilter & {
  page?: number;
  size?: number;
  sortKey?: "name" | "version";
  sortOrder?: "ascending" | "descending";
};

export type SeriesImage = {
  id: number;
  name: string;
  buildStatus: BuildStatus | typeof NOT_DEFINED;
  testStatus: TestStatus | null | typeof NOT_DEFINED;
  bugs: string[] | typeof NOT_DEFINED;
  version: string;
  url: string;
  fileSize: number | typeof NOT_DEFINED;
  series: string;
  product: Product | string;
};

export type SeriesImageCounts = {
  total: number;
  building: {
    total: number;
    successful: number;
    failed: number;
    running: number;
  };
  testing: {
    total: number;
    passed: number;
    failed: number;
    running: number;
  };
};

export type ArtifactsCache = {
  expiresAt?: number;
  promise: Promise<ImageArtifact[]>;
};
