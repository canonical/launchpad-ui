import * as v from "valibot";
import type { Product } from "$lib/modules/distroseries/images/types.js";
import { imagesFixture } from "./image.fixtures.js";
import { imageArtifactSchema } from "./types.js";
import type {
  ImageArtifact,
  ImagesFilter,
  ImagesQuery,
  Paginated,
  SeriesImage,
  SeriesImageCounts,
} from "./types.js";
import { env } from "$env/dynamic/private";

if (!env.TEST_OBSERVER_IMAGE_ARTIFACTS_URL) {
  console.warn(
    "TEST_OBSERVER_IMAGE_ARTIFACTS_URL is not configured; using fixture image data",
  );
}

const CACHE_TTL = 60_000;
let cachedArtifacts:
  | { expiresAt: number; artifacts: ImageArtifact[] }
  | undefined;
let pendingPromise: Promise<ImageArtifact[]> | undefined;

export class TestObserverApiError extends Error {
  constructor(
    public readonly status: number,
    url: string,
  ) {
    super(`Test Observer request to ${url} failed with status ${status}`);
    this.name = "TestObserverApiError";
  }
}

export async function getImages(
  series: string,
  query: ImagesQuery = {},
): Promise<Paginated<SeriesImage>> {
  const images = await getFilteredImages(series, query);
  const { sortKey, sortOrder, page = 1 } = query;
  if (sortKey && sortOrder && sortOrder !== "none") {
    const field = sortKey === "image-name" ? "name" : "version";
    images.sort((first, second) => {
      const comparison = first[field].localeCompare(second[field], "en", {
        numeric: true,
      });
      return sortOrder === "ascending" ? comparison : -comparison;
    });
  }
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;
  return {
    items: images.slice(offset, offset + pageSize),
    total: images.length,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

export async function getImageCounts(
  series: string,
  filter: ImagesFilter = {},
): Promise<SeriesImageCounts> {
  return (await getFilteredImages(series, filter)).reduce<SeriesImageCounts>(
    (counts, image) => {
      counts.total++;
      counts.building.total++;
      counts.building[image.buildStatus]++;
      if (image.testStatus) {
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
  const images = env.TEST_OBSERVER_IMAGE_ARTIFACTS_URL
    ? (await getImageArtifacts()).map(
        (artifact): SeriesImage => ({
          id: artifact.id,
          product: osToProductMapper(artifact.os),
          name: artifact.name,
          buildStatus: "failed",
          testStatus: null,
          bugs: [],
          version: artifact.version,
          url: artifact.image_url,
          fileSize: 0,
          series: artifact.release,
        }),
      )
    : imagesFixture;

  return images.filter(
    (image) =>
      image.series === series &&
      (!filter.product || image.product === filter.product) &&
      (!filter.buildStatus || image.buildStatus === filter.buildStatus) &&
      (!filter.testStatus || image.testStatus === filter.testStatus),
  );
}

export async function getImageArtifacts(): Promise<ImageArtifact[]> {
  const url = env.TEST_OBSERVER_IMAGE_ARTIFACTS_URL;
  if (!url)
    throw new Error("TEST_OBSERVER_IMAGE_ARTIFACTS_URL is not configured");

  if (cachedArtifacts && cachedArtifacts.expiresAt > Date.now())
    return cachedArtifacts.artifacts;
  if (pendingPromise) return pendingPromise;

  const promise = fetchImageArtifacts(url);
  pendingPromise = promise;
  try {
    const artifacts = await promise;
    cachedArtifacts = { artifacts, expiresAt: Date.now() + CACHE_TTL };
    return artifacts;
  } finally {
    pendingPromise = undefined;
  }
}

async function fetchImageArtifacts(url: string): Promise<ImageArtifact[]> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) throw new TestObserverApiError(response.status, url);

  return v.parse(v.array(imageArtifactSchema), await response.json());
}

const osToProductMapper = (os: string): Product | null => {
  switch (os) {
    case "edubuntu":
      return "edubuntu";
    case "kubuntu":
      return "kubuntu";
    case "lubuntu":
      return "lubuntu";
    case "ubuntu":
      return "ubuntu";
    case "ubuntu-base":
      return "ubuntu-base";
    case "ubuntu-budgie":
      return "ubuntu-budgie";
    case "ubuntucinnamon":
      return "ubuntu-cinnamon";
    case "ubuntu-core":
      return "ubuntu-core";
    case "ubuntu-core-installer":
      return "ubuntu-core-installer";
    case "ubuntukylin":
      return "ubuntu-kylin";
    case "ubuntu-mate":
      return "ubuntu-mate";
    case "ubuntu-mini-iso":
      return "ubuntu-mini-iso";
    case "ubuntu-server":
      return "ubuntu-server";
    case "ubuntustudio":
      return "ubuntu-studio";
    case "ubuntu-unity":
      return "ubuntu-unity";
    case "ubuntu-wsl":
      return "ubuntu-wsl";
    case "xubuntu":
      return "xubuntu";
    default:
      return null;
  }
};
