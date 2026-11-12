import * as v from "valibot";
import { NOT_DEFINED } from "#lib/modules/distroseries/constants.js";
import type { Product } from "#lib/modules/distroseries/images/types.js";
import type { Paginated } from "../common/types.js";
import { imageArtifactSchema } from "./types.js";
import type {
  ArtifactsCache,
  ImageArtifact,
  ImagesFilter,
  ImagesQuery,
  SeriesImage,
  SeriesImageCounts,
} from "./types.js";
import { TEST_OBSERVER_IMAGE_ARTIFACTS_URL } from "$app/env/private";

const CACHE_TTL = 10 * 60_000;
const DEFAULT_PAGE_SIZE = 10;

let artifactRequest: ArtifactsCache | undefined;

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
    const order = sortOrder === "ascending" ? 1 : -1;
    images.sort(
      (first, second) =>
        order *
        first[sortKey].localeCompare(second[sortKey], "en", {
          numeric: true,
        }),
    );
  }
  const pageSize = query.size ?? DEFAULT_PAGE_SIZE;
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
      if (image.buildStatus !== NOT_DEFINED) {
        counts.building.total++;
        counts.building[image.buildStatus]++;
      }
      if (image.testStatus !== NOT_DEFINED && image.testStatus !== null) {
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
    buildStatus: NOT_DEFINED,
    testStatus: NOT_DEFINED,
    bugs: NOT_DEFINED,
    version: artifact.version,
    url: artifact.image_url,
    fileSize: NOT_DEFINED,
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
  // TODO: Implement a consistent caching strategy as tracked in https://warthogs.atlassian.net/browse/LP-5124
  if (
    artifactRequest &&
    (artifactRequest.expiresAt === undefined ||
      artifactRequest.expiresAt > Date.now())
  ) {
    return artifactRequest.promise;
  }

  const request: ArtifactsCache = {
    promise: fetchImageArtifacts(TEST_OBSERVER_IMAGE_ARTIFACTS_URL)
      .then((artifacts) => {
        request.expiresAt = Date.now() + CACHE_TTL;
        return artifacts;
      })
      .catch((error) => {
        if (artifactRequest === request) artifactRequest = undefined;
        throw error;
      }),
  };

  artifactRequest = request;
  return request.promise;
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
