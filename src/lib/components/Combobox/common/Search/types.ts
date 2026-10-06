/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { SearchBoxProps } from "@canonical/svelte-ds-app-launchpad";

export type SearchProps = SearchBoxProps & {
  /** Called for keys neither cancelled by onkeydown nor handled internally. */
  onkeydownUnhandled?: SearchBoxProps["onkeydown"];
};
