/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

export interface ButtonItemProps extends WithoutChildren<HTMLButtonAttributes> {
  selected?: boolean;
  icon?: Snippet<[]>;
  label: string;
}
