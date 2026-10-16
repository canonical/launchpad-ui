import type { Product } from "$lib/modules/distroseries/images/types.js";
import { getImages as getFixtureImages } from "../image-fixture/client.js";
import { getImageArtifacts } from "../test-observer/client.js";
import type {
  ImagesFilter,
  ImagesQuery,
  Paginated,
  SeriesImage,
  SeriesImageCounts,
} from "./types.js";

export const imageFetcher = {
  testObserver: async (): Promise<SeriesImage[]> =>
    (await getImageArtifacts()).map((artifact) => ({
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
    })),
  fixture: getFixtureImages,
};

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

/**
 * Here you can switch the image provider between "testObserver" and "fixture" for fetching images.
 */
const IMAGE_PROVIDER: keyof typeof imageFetcher = "fixture";

export async function getImages(
  series: string,
  query: ImagesQuery = {},
): Promise<Paginated<SeriesImage>> {
  const images = filterImages(
    await imageFetcher[IMAGE_PROVIDER](),
    series,
    query,
  );
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
  return filterImages(
    await imageFetcher[IMAGE_PROVIDER](),
    series,
    filter,
  ).reduce<SeriesImageCounts>(
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

function filterImages(
  images: SeriesImage[],
  series: string,
  filter: ImagesFilter,
) {
  return images.filter(
    (image) =>
      image.series === series &&
      (!filter.product || image.product === filter.product) &&
      (!filter.buildStatus || image.buildStatus === filter.buildStatus) &&
      (!filter.testStatus || image.testStatus === filter.testStatus),
  );
}
