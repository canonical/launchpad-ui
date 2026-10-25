import { LaunchpadApiError, fetchFollowingRedirects } from "./client.js";
import { launchpadFetchStream } from "./launchpadFetch.js";

const ARTIFACT_HEADERS = { "accept-encoding": "identity" };

/**
 * Final url after all the redirects.
 * Usually launchpad redirects to a librarian URL.
 */
export async function resolveArtifactUrl(url: string): Promise<string> {
  const { url: finalUrl, response } = await fetchFollowingRedirects(
    url,
    { method: "HEAD", headers: ARTIFACT_HEADERS },
    launchpadFetchStream,
  );
  await response.body?.cancel();
  if (!response.ok) {
    throw new LaunchpadApiError(response.status, finalUrl);
  }
  return finalUrl;
}

export async function getArtifactStream(
  url: string,
): Promise<ReadableStream<Uint8Array>> {
  const response = await launchpadFetchStream(url, {
    headers: ARTIFACT_HEADERS,
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new LaunchpadApiError(response.status, url);
  }
  return response.body!;
}
