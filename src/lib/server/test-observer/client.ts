import { env } from "process";
import * as v from "valibot";
import type { Paginated } from "#lib/api/common/types.js";
import type { Product } from "#lib/modules/distroseries/images/types.js";
import { imageArtifactSchema } from "./types.js";
import type {
  ImageArtifact,
  ImagesFilter,
  ImagesQuery,
  SeriesImage,
  SeriesImageCounts,
} from "./types.js";

const CACHE_TTL = 10 * 60_000;

let artifactRequest:
  { expiresAt?: number; promise: Promise<ImageArtifact[]> } | undefined;

export class TestObserverApiError extends Error {
  constructor(
    public readonly status: number,
    url: string,
  ) {
    super(`Test Observer request to ${url} failed with status ${status}`);
    this.name = "TestObserverApiError";
  }
}

export async function getUbuntuImages(
  series: string,
  query: ImagesQuery = {},
): Promise<Paginated<SeriesImage>> {
  const images = await getFilteredImages(series, query);
  const { sortKey, sortOrder, page = 1 } = query;
  if (sortKey && sortOrder) {
    const field = sortKey === "name" ? "name" : "version";
    const order = sortOrder === "ascending" ? 1 : -1;
    images.sort(
      (first, second) =>
        order *
        first[field].localeCompare(second[field], "en", {
          numeric: true,
        }),
    );
  }
  const pageSize = query.size ?? 10;
  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;
  return {
    items: images.slice(offset, offset + pageSize),
    total: images.length,
    page: currentPage,
    size: pageSize,
  };
}

export async function getUbuntuImageCounts(
  series: string,
  filter: ImagesFilter = {},
): Promise<SeriesImageCounts> {
  return (await getFilteredImages(series, filter)).reduce<SeriesImageCounts>(
    (counts, image) => {
      counts.total++;
      if (image.buildStatus !== "<not defined>") {
        counts.building.total++;
        counts.building[image.buildStatus]++;
      }
      if (image.testStatus !== "<not defined>" && image.testStatus !== null) {
        counts.testing.total++;
        counts.testing[image.testStatus]++;
      }
      return counts;
    },
    {
      total: 0,
      building: { total: 0, successful: 0, failed: 0, running: 0 },
      testing: { total: 0, passed: 0, failed: 0, running: 0 },
    },
  );
}

async function getFilteredImages(
  series: string,
  filter: ImagesFilter,
): Promise<SeriesImage[]> {
  const images = (await getImageArtifacts()).map((artifact): SeriesImage => ({
    id: artifact.id,
    product: osToProductMapper(artifact.os),
    name: artifact.name,
    buildStatus: "<not defined>",
    testStatus: "<not defined>",
    bugs: "<not defined>",
    version: artifact.version,
    url: artifact.image_url,
    fileSize: "<not defined>",
    series: artifact.release,
  }));

  return images.filter(
    (image) =>
      image.series === series &&
      (!filter.product || image.product === filter.product) &&
      (!filter.buildStatus || image.buildStatus === filter.buildStatus) &&
      (!filter.testStatus || image.testStatus === filter.testStatus),
  );
}

export function getImageArtifacts(): Promise<ImageArtifact[]> {
  const url = env.TEST_OBSERVER_IMAGE_ARTIFACTS_URL;
  if (!url)
    throw new Error("TEST_OBSERVER_IMAGE_ARTIFACTS_URL is not configured");

  if (
    artifactRequest &&
    (artifactRequest.expiresAt === undefined ||
      artifactRequest.expiresAt > Date.now())
  ) {
    return artifactRequest.promise;
  }

  const newPromise = fetchImageArtifacts(url)
    .then((imgArtifacts) => {
      artifactRequest = {
        promise: newPromise,
        expiresAt: Date.now() + CACHE_TTL,
      };
      return imgArtifacts;
    })
    .catch((error) => {
      artifactRequest = undefined;
      throw error;
    });

  artifactRequest = { promise: newPromise };

  return newPromise;
}

async function fetchImageArtifacts(url: string): Promise<ImageArtifact[]> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) throw new TestObserverApiError(response.status, url);

  return v.parse(v.array(imageArtifactSchema), await response.json());
}

/** Return a Product when mapped, or preserve unknown OS values for display. */
const osToProductMapper = (os: string): Product | string => {
  switch (os) {
    case "ubuntucinnamon":
      return "ubuntu-cinnamon";
    case "ubuntukylin":
      return "ubuntu-kylin";
    case "ubuntustudio":
      return "ubuntu-studio";
    default:
      return os;
  }
};
