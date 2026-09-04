import pLimit from "p-limit";
import { getBinaryFileUrls } from "$lib/server/launchpad/client.js";
import { deduplicate } from "$lib/utils/deduplicate.js";
import type { BinaryPackageArtifact } from "./binary-package.types.js";

const MAX_CONCURRENT_FILE_REQUESTS = 16;

export type BinaryPackagePublication = {
  selfLink: string;
  architecture: string;
};

export async function loadBinaryPackageArtifacts(
  publications: BinaryPackagePublication[],
): Promise<BinaryPackageArtifact[]> {
  const uniquePublications = deduplicate(publications, "selfLink");
  const limit = pLimit(MAX_CONCURRENT_FILE_REQUESTS);

  const perPublication = await Promise.all(
    uniquePublications.map((publication) =>
      limit(async () => ({
        architecture: publication.architecture,
        metas: await getBinaryFileUrls(publication.selfLink),
      })),
    ),
  );
  const artifacts = perPublication.flatMap(({ architecture, metas }) =>
    metas.map((meta) => ({
      id: meta.url,
      architecture,
      fileName: decodeURIComponent(
        new URL(meta.url).pathname.split("/").pop() ?? "",
      ),
      size: meta.size,
      url: meta.url,
    })),
  );
  return deduplicate(artifacts, "url");
}
