import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { getPublishedBinaries } from "$lib/server/launchpad/client.js";
import type { BinaryPackagePublication } from "./binary-package.server.js";
import { loadBinaryPackageArtifacts } from "./binary-package.server.js";
import type { BinaryPackageDetails } from "./binary-package.types.js";
import { query } from "$app/server";

const argsSchema = v.object({
  distro: v.pipe(v.string(), v.trim(), v.minLength(1)),
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
  sourcePackageId: v.pipe(v.string(), v.regex(/^\d+$/)),
});

/**
 * Fetches the details of a binary package, including its artifacts.
 * Check TODOs for the improvements that needs discussion with Launchpad team to be implemented.
 * TODOs:
 * - There should be a method that filters by source publication id AND binary package name AND published status
 * - That method should return file urls to the artifacts
 * - That method should include description and download all url
 */
export const getBinaryPackage = query(
  argsSchema,
  async ({ distro, name, sourcePackageId }): Promise<BinaryPackageDetails> => {
    let publications: BinaryPackagePublication[];
    try {
      const entries = await getPublishedBinaries(distro, sourcePackageId);
      publications = entries
        .filter(
          //TODO: check with launchpad if it can be implemented server side
          (entry) =>
            entry.binary_package_name === name && entry.status === "Published",
        )
        .map((entry) => ({
          selfLink: entry.self_link,
          architecture: entry.distro_arch_series_link.split("/").pop() ?? "",
        }));
    } catch (requestError) {
      console.error("Failed to load binary package publications", requestError);
      error(503, "Couldn't load the binary package from Launchpad.");
    }
    if (publications.length === 0) {
      error(404, `No published binary package named ${name} was found.`);
    }

    let artifacts: BinaryPackageDetails["artifacts"];
    try {
      //TODO: ideally this should be comming in the first request
      artifacts = await loadBinaryPackageArtifacts(publications);
    } catch (requestError) {
      console.error("Failed to load binary package files", requestError);
      error(503, "Couldn't load the binary package files from Launchpad.");
    }

    return {
      // TODO: fill summary once Launchpad exports it
      // TODO: fill description once Launchpad exports it
      // TODO: fill downloadUrl once the bundled-download endpoint exists
      artifacts,
    };
  },
);
