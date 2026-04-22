/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { ModifierFamily } from "@canonical/svelte-ds-app-launchpad";
import type { HTMLSelectAttributes } from "svelte/elements";

export interface SelectProps
  extends HTMLSelectAttributes, ModifierFamily<"severity"> {
  /**
   * The value of the select.
   *
   * **@bindable**
   */
  value?: HTMLSelectAttributes["value"];
  /**
   * The ref of the select.
   *
   * **@bindable**
   */
  ref?: HTMLSelectElement;
  density?: "dense" | "medium";
}
