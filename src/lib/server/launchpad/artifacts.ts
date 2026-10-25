import { LaunchpadApiError } from "@canonical/launchpad-client";
import { launchpadFetch } from "./client.js";

const ARTIFACT_HEADERS = { "accept-encoding": "identity" };

/**
 * Final url after all the redirects.
 * Usually launchpad redirects to a librarian URL.
 */
export async function resolveArtifactUrl(url: string): Promise<string> {
  const response = await launchpadFetch(url, {
    method: "HEAD",
    headers: ARTIFACT_HEADERS,
  });
  await response.body?.cancel();
  if (!response.ok) {
    throw new LaunchpadApiError(response, undefined);
  }
  return response.url;
}

export async function getArtifactStream(
  url: string,
): Promise<ReadableStream<Uint8Array>> {
  const response = await launchpadFetch(url, { headers: ARTIFACT_HEADERS });
  if (!response.ok) {
    await response.body?.cancel();
    throw new LaunchpadApiError(response, undefined);
  }
  return response.body!;
}
