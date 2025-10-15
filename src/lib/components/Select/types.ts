/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { HTMLSelectAttributes } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers";
import type { SelectInputModifiers } from "./modifiers";

type BaseProps = HTMLSelectAttributes &
  ModifiedBy<SelectInputModifiers> & {
    /**
     * The ref of the select.
     *
     * @bindable
     */
    ref?: HTMLSelectElement;
  };

export interface SingleSelectProps<T> extends BaseProps {
  /**
   * The value of the select.
   *
   * @bindable
   */
  value?: T;
}

export interface MultiSelectProps<T> extends BaseProps {
  multiple: true;
  /**
   * The value of the select.
   *
   * @bindable
   */
  value?: T[];
}

export type SelectProps<T = BaseProps["value"]> =
  | SingleSelectProps<T>
  | MultiSelectProps<T>;
