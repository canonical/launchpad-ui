/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { ButtonPrimitiveProps } from "$lib/components/common/index.js";

export type NavigationItemProps = ButtonPrimitiveProps & {
  /**
   * Whether the item should appear selected.
   */
  selected?: boolean;
  /**
   * An optional icon to be displayed alongside the item text.
   */
  icon?: Snippet<[]>;
  /**
   * Content to be displayed inside the item.
   */
  children: Snippet<[]>;
};
