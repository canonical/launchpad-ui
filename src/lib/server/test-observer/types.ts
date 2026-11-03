import * as v from "valibot";
import type {
  BuildStatus,
  Product,
  TestStatus,
} from "$lib/modules/distroseries/images/types";

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
  sortKey?: "image-name" | "version" | null;
  sortOrder?: "ascending" | "descending" | "none";
};

export type SeriesImage = {
  id: number;
  name: string;
  buildStatus: BuildStatus;
  testStatus: TestStatus | null;
  bugs: string[];
  version: string;
  url: string;
  fileSize: number;
  series: string;
  product: Product | null;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
