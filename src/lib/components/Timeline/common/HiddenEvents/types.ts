/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { SvelteHTMLElements } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

type BaseProps = WithoutChildren<SvelteHTMLElements["li"]>;

export interface HiddenEventsProps extends BaseProps {
  /**
   * The number of hidden events.
   */
  numHidden: number;
  /**
   * The URL to show more hidden events.
   */
  showMoreHref?: string;
  /**
   * The URL to show all hidden events.
   */
  showAllHref?: string;
}
