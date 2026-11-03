import { createLaunchpadClient } from "@canonical/launchpad-client";
import createDispatcher from "./createDispatcher.js";
import { env } from "$env/dynamic/private";

export const launchpadApiBaseUrl = env.MAIN_LAUNCHPAD_BASE_HOST
  ? new URL("/api/devel/", env.MAIN_LAUNCHPAD_BASE_HOST).href
  : "https://api.launchpad.net/devel/";

const dispatcher =
  env.MAIN_LAUNCHPAD_IP_ADDRESS || env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY === "true"
    ? createDispatcher({
        baseUrl: launchpadApiBaseUrl,
        connectTo: env.MAIN_LAUNCHPAD_IP_ADDRESS,
        rejectUnauthorized: env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY !== "true",
      })
    : undefined;
const fetcher = globalThis.fetch;

// Shared transport only: user cookies belong in per-request headers.
export const launchpadClient = createLaunchpadClient({
  baseUrl: launchpadApiBaseUrl,
  fetch: dispatcher
    ? (input, init) => {
        const connectionOptions = { ...init, dispatcher };
        return fetcher(input, connectionOptions);
      }
    : undefined,
});

type LaunchpadUrlSegment = string | null | undefined;

/**
 * Build an absolute Launchpad API link, e.g. for entry-reference parameters.
 * `~` and `+` prefix the next segment (`launchpadUrl("~", name)` → `…/~name`);
 * every other segment is URL-encoded and joined with `/`.
 * @returns `undefined` if any segment is missing, so optional filters pass through.
 * @throws TypeError for `.`/`..` segments, which would escape the API prefix.
 */
export function launchpadUrl(...segments: string[]): string;
export function launchpadUrl(
  ...segments: LaunchpadUrlSegment[]
): string | undefined;
export function launchpadUrl(
  ...segments: LaunchpadUrlSegment[]
): string | undefined {
  let path = "";
  let separator = "";
  for (const segment of segments) {
    if (segment === null || segment === undefined) return undefined;
    if (segment === "." || segment === "..") {
      throw new TypeError(`Invalid Launchpad URL segment: ${segment}`);
    }
    const isPrefix = segment === "~" || segment === "+";
    path += separator + (isPrefix ? segment : encodeURIComponent(segment));
    separator = isPrefix ? "" : "/";
  }
  return new URL(path, launchpadApiBaseUrl).href;
}
