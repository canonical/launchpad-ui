/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface HeaderProps extends BaseProps {
  /**
   * The controls to render in the header.
   *
   * @example
   * ```svelte
   * {#snippet controls()}
   *  <Button>Preview</Button>
   * {/snippet}
   * ```
   *
   */
  controls?: Snippet;
}
