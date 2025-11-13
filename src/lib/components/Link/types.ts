/* @canonical/generator-ds 0.10.0-experimental.4 */

import type { HTMLAnchorAttributes } from "svelte/elements";

export interface LinkProps extends HTMLAnchorAttributes {
  /**
   * Whether the link should be styled as a soft link.
   */
  soft?: boolean;
}
