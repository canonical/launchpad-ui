/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { ButtonPrimitiveProps } from "@canonical/svelte-ds-app-launchpad/internal";
import type { Snippet } from "svelte";

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
