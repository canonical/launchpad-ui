/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { Snippet } from "svelte";

export interface ItemContentProps {
  /**
   * The main text content of the item.
   */
  text: string;
  /**
   * An optional icon to display alongside the text.
   */
  icon?: Snippet<[]>;
  /**
   * An optional secondary text to display below the main text.
   */
  secondaryText?: string;
  /**
   * An optional trailing text of the item.
   */
  trailingText?: string;
}
