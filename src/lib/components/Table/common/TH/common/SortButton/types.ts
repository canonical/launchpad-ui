/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { HTMLButtonAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

export interface SortButtonProps extends WithoutChildren<HTMLButtonAttributes> {
  /**
   * Label describing the sort action of the button.
   *
   * @example "Sort by Name ascending", "Sort by Name descending", "Remove sorting by Name"
   */
  "aria-label": string;
}
