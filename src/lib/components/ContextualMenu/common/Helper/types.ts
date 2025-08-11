/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface HelperProps extends BaseProps {
  /**
   * Identifier passed from the `ContextualMenu`, to properly associate the helper with its parent.
   */
  id: string;
  /**
   * Icon displayed alongside the helper content.
   */
  icon?: Snippet<[]>;
  /**
   * Content rendered inside the helper.
   */
  children: Snippet<[]>;
}
