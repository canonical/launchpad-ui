/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

export interface LinkItemProps extends HTMLAnchorAttributes {
  disabled?: boolean;
  selected?: boolean;
  icon?: Snippet<[]>;
  children: Snippet<[]>;
}
