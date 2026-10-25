import { error } from "@sveltejs/kit";
import { getBinaryPackage } from "$lib/modules/packages/binary-package/binary-package.remote.js";
import { binaryPackageArchive } from "$lib/server/launchpad/binaryPackageArchive.js";
import type { RequestHandler } from "./$types.js";

const ARTIFACTS_UNAVAILABLE_MESSAGE =
  "Couldn't fetch the artifacts of this binary package from Launchpad. Try again shortly.";

export const GET: RequestHandler = async ({ params }) => {
  const details = await getBinaryPackage({
    distro: params.pillar,
    binaryId: params.binaryId,
  });
  return binaryPackageArchive(details).catch(throwArtifactsError);
};

export const HEAD: RequestHandler = async (event) => {
  const response = await GET(event);
  await response.body?.cancel();
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
};

function throwArtifactsError(cause: unknown): never {
  console.error("Failed to resolve binary package artifacts", cause);
  error(502, ARTIFACTS_UNAVAILABLE_MESSAGE);
}
