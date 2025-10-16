/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { HTMLSelectAttributes } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers";
import type { SelectInputModifiers } from "./modifiers";

type BaseProps = Omit<HTMLSelectAttributes, "value">;

export interface SelectProps
  extends BaseProps,
    ModifiedBy<SelectInputModifiers> {
  /**
   * The value of the select.
   *
   * @bindable
   */
  value?: HTMLSelectAttributes["value"];
  /**
   * The ref of the select.
   *
   * @bindable
   */
  ref?: HTMLSelectElement;
}
