import { MAIN_LAUNCHPAD_BASE_HOST } from "$app/env/private";

export const launchpadApiBaseUrl = new URL(
  "/api/devel/",
  MAIN_LAUNCHPAD_BASE_HOST,
).href;

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
