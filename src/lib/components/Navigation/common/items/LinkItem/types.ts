/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

export interface LinkItemProps extends WithoutChildren<HTMLAnchorAttributes> {
  disabled?: boolean;
  selected?: boolean;
  icon?: Snippet<[]>;
  label: string;
}
