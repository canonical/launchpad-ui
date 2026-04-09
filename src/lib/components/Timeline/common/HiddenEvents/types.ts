/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

type BaseProps = WithoutChildren<SvelteHTMLElements["li"]>;

export interface HiddenEventsProps extends BaseProps {
  /**
   * The number of hidden events.
   */
  numHidden: number;
  /**
   * Link content to render alongside the hidden events count.
   */
  children?: Snippet<[]>;
}
