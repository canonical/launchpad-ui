/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface ContextualMenuProps extends BaseProps {
  /**
   * Helper content providing additional context or information for the entire menu.
   */
  helper?: Snippet<[id: string]>;
}
