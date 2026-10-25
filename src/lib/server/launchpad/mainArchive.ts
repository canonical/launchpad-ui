/**
 * Name of a distribution's main archive, as used in `+archive/<name>` API paths.
 *
 * Launchpad returns it in the distribution's `main_archive_link`. It is
 * `primary` for every distribution except openSUSE, where it is `default`. As
 * of 2026-10-25 that archive holds no packages. An extra API call to cover this
 * case has no real benefit but a real performance cost, so we return `primary`
 * for all distributions.
 */
export function getMainArchiveName(_distribution: string): string {
  return "primary";
}
