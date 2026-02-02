/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { HTMLAnchorAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

export interface SortLinkProps extends WithoutChildren<HTMLAnchorAttributes> {
  /**
   * Label describing the sort action of the link.
   *
   * @example "Sort by Name ascending", "Sort by Name descending", "Remove sorting by Name"
   */
  "aria-label": string;
}
