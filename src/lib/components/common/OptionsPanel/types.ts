/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { WithRef } from "$lib/type-utils.js";

type BaseProps = SvelteHTMLElements["div"];

export interface OptionPanelContentProps {
  /**
   * Helper content providing additional context or information for the entire panel.
   */
  helper?: Snippet<[id: string]>;
  /**
   * Footer content, often used for actions related to the panel's content.
   */
  footer?: Snippet<[]>;
}

export interface OptionsPanelProps
  extends BaseProps,
    WithRef<HTMLDivElement>,
    OptionPanelContentProps {}
