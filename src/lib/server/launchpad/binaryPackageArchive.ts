import { storedZip } from "$lib/server/zip/storedZip.js";
import { getArtifactStream, resolveArtifactUrl } from "./artifacts.js";
import type { BinaryPackageDetails } from "./types.js";

export async function binaryPackageArchive(
  details: BinaryPackageDetails,
): Promise<Response> {
  const entries = await Promise.all(
    details.files.map(async (file) => {
      const url = await resolveArtifactUrl(file.url);
      return {
        name: file.filename,
        size: file.size,
        open: () => getArtifactStream(url),
      };
    }),
  );
  const { body, length } = storedZip(entries);
  const filename = archiveFilename(
    details.binary_package_name,
    details.binary_package_version,
  );
  return new Response(body, {
    headers: {
      "content-type": "application/zip",
      "content-length": String(length),
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "private, no-store",
    },
  });
}

function archiveFilename(name: string, version: string): string {
  return `${name}_${version.replace(/^\d+:/, "")}.zip`;
}
