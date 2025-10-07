/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

export interface ButtonItemProps extends HTMLButtonAttributes {
  selected?: boolean;
  icon?: Snippet<[]>;
  children: Snippet<[]>;
}
