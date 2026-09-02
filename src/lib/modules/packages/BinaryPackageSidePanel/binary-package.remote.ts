import { error } from "@sveltejs/kit";
import * as v from "valibot";
import {
  getBinaryFileUrls,
  getPublishedBinaries,
} from "$lib/server/launchpad/client.js";
import type { BinaryPackagePublishingEntry } from "$lib/server/launchpad/types.js";
import { query } from "$app/server";

const argsSchema = v.object({
  distro: v.pipe(v.string(), v.trim(), v.minLength(1)),
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

export type BinaryPackageArgs = v.InferInput<typeof argsSchema>;

export type BinaryPackageArtifact = {
  id: string;
  architecture: string;
  fileName: string;
  size: number;
  url: string;
};

export type BinaryPackageDetails = {
  summary: string;
  artifacts: BinaryPackageArtifact[];
  description?: string;
  downloadUrl?: string;
};

const MAX_ARTIFACT_PUBLICATIONS = 8;

export const getBinaryPackage = query(
  argsSchema,
  async ({ distro, name }): Promise<BinaryPackageDetails> => {
    let entries: BinaryPackagePublishingEntry[];
    try {
      ({ entries } = await getPublishedBinaries(distro, {
        binaryName: name,
        size: 100,
      }));
    } catch (requestError) {
      console.error("Failed to load binary package", requestError);
      error(503, "Couldn't load the binary package from Launchpad.");
    }
    if (entries.length === 0) {
      error(404, `No published binary package named ${name} in ${distro}.`);
    }

    const newest = newestFirst(entries)[0];
    const currentPublications = entries
      .filter(
        (entry) =>
          entry.binary_package_version === newest.binary_package_version &&
          seriesOf(entry) === seriesOf(newest),
      )
      .slice(0, MAX_ARTIFACT_PUBLICATIONS);

    let artifacts: BinaryPackageArtifact[];
    try {
      artifacts = await loadArtifacts(currentPublications);
    } catch (requestError) {
      console.error("Failed to load binary package files", requestError);
      error(503, "Couldn't load the binary package files from Launchpad.");
    }

    return {
      summary: newest.display_name,
      // TODO: fill description once Launchpad exports binary descriptions on the webservice
      // TODO: fill downloadUrl once the bundled-download endpoint exists

      artifacts,
    };
  },
);

async function loadArtifacts(
  publications: BinaryPackagePublishingEntry[],
): Promise<BinaryPackageArtifact[]> {
  const perPublication = await Promise.all(
    publications.map(async (entry) => ({
      architecture: architectureOf(entry),
      metas: await getBinaryFileUrls(entry.self_link),
    })),
  );
  const byFileName = new Map<string, BinaryPackageArtifact>();
  for (const { architecture, metas } of perPublication) {
    for (const meta of metas) {
      const fileName = decodeURIComponent(
        new URL(meta.url).pathname.split("/").pop() ?? "",
      );
      if (!byFileName.has(fileName)) {
        byFileName.set(fileName, {
          id: meta.url,
          architecture,
          fileName,
          size: meta.size,
          url: meta.url,
        });
      }
    }
  }
  return [...byFileName.values()];
}

function newestFirst(
  entries: BinaryPackagePublishingEntry[],
): BinaryPackagePublishingEntry[] {
  return [...entries].sort((a, b) =>
    (b.date_published ?? "").localeCompare(a.date_published ?? ""),
  );
}

function architectureOf(entry: BinaryPackagePublishingEntry): string {
  return entry.distro_arch_series_link.split("/").pop() ?? "";
}

function seriesOf(entry: BinaryPackagePublishingEntry): string {
  return entry.distro_arch_series_link.split("/").at(-2) ?? "";
}
