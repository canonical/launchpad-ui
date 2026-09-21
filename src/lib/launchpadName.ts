export const LAUNCHPAD_NAME_PATTERN = /^[a-z0-9][a-z0-9+.-]*$/;

const PERSON_REFERENCE_PATTERN =
  /^(?:https?:\/\/[^/?#\s]+\/(?:(?:api\/)?[^/?#\s]+\/)?)?~([^/?#\s]+)\/?$/i;

export function toLaunchpadName(text?: string | null): string | null {
  if (!text) return null;

  const trimmed = text.trim();
  const referencedName = PERSON_REFERENCE_PATTERN.exec(trimmed)?.[1] ?? trimmed;
  const name = referencedName.toLowerCase();
  return LAUNCHPAD_NAME_PATTERN.test(name) ? name : null;
}
