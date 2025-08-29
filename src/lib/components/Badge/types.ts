/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { SvelteHTMLElements } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers";
import type { WithoutChildren } from "$lib/type-utils.js";
import type { BadgeModifiers } from "./modifiers.js";

type BaseProps = SvelteHTMLElements["span"];

export interface BadgeProps
  extends WithoutChildren<BaseProps>,
    ModifiedBy<BadgeModifiers> {
  /**
   * The non-negative integer value displayed within the badge. Negative values will be clamped to 0. Floats will be rounded.
   */
  value: number;
  /**
   * - `capped` should be use whenever the amount of items is only relevant for small values. If the `value` is larger than 999, it will be displayed as `999+`.
   * - `rounded` should be used whenever differences between large amounts of items are relevant. Values larger than 999 will be displayed as `1k`, `2.5M`, etc.
   *
   * @default "capped"
   */
  variant?: "capped" | "rounded";
}
