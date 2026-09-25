// Matches Launchpad's valid_name_pattern:
// https://git.launchpad.net/launchpad/tree/lib/lp/app/validators/name.py
export const LAUNCHPAD_NAME_PATTERN = /^[a-z0-9][a-z0-9+.-]+$/;

/**
 * Extract a lowercase Launchpad name from a name or person reference.
 *
 * Trims surrounding whitespace and accepts plain names, `~name` references,
 * and HTTP(S) URLs with paths `/~name`, `/version/~name`, or `/api/version/~name`.
 * Person references and URLs may have one trailing slash. URLs with queries,
 * fragments, stripped control characters, or paths repaired by URL parsing
 * are rejected.
 *
 * Validates the extracted name against {@link LAUNCHPAD_NAME_PATTERN}.
 * Does not require a Launchpad hostname or verify whether the name exists.
 *
 * @param text - A name or person reference to normalize.
 * @returns The normalized name, or `null` for missing, blank, or invalid input.
 */
export function toLaunchpadName(text?: string | null): string | null {
  const reference = text?.trim().toLowerCase();
  if (!reference) return null;

  if (reference.startsWith("http://") || reference.startsWith("https://")) {
    const url = URL.parse(reference);
    if (url === null) return null;
    if (isModifiedUrlOrHasQueryOrFragment(reference, url)) return null;
    return extractNameFromPersonReference(reference, url);
  }

  return extractNameFromPersonReference(reference);
}

function isModifiedUrlOrHasQueryOrFragment(
  reference: string,
  url: URL,
): boolean {
  const pathStart = reference.indexOf("/", reference.indexOf("://") + 3);
  return (
    reference.includes("\t") ||
    reference.includes("\n") ||
    reference.includes("\r") ||
    pathStart === -1 ||
    reference.slice(pathStart) !== url.pathname
  );
}

function extractNameFromPersonReference(
  reference: string,
  url?: URL,
): string | null {
  if (url !== undefined) {
    const segments = url.pathname.slice(1).split("/");
    if (segments.at(-1) === "") segments.pop();
    const personReference = segments.pop();
    const supportedPrefix =
      segments.length <= 1 || (segments.length === 2 && segments[0] === "api");
    if (
      !personReference?.startsWith("~") ||
      !supportedPrefix ||
      segments.includes("")
    ) {
      return null;
    }
    reference = personReference;
  }

  if (reference.startsWith("~")) {
    reference = reference.slice(1);
    if (reference.endsWith("/")) reference = reference.slice(0, -1);
  }

  return LAUNCHPAD_NAME_PATTERN.test(reference) ? reference : null;
}
