/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface HelperProps extends BaseProps {
  /**
   * Id of the element the helper is associated with.
   */
  id: string;
  /**
   * Icon displayed alongside the helper content.
   */
  icon?: Snippet<[]>;
  /**
   * Content displayed inside the helper.
   */
  children: Snippet<[]>;
}
