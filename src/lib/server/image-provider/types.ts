import type {
  BuildStatus,
  Product,
  TestStatus,
} from "$lib/modules/distroseries/images/types";

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
