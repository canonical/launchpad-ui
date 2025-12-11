/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

interface BaseProps extends WithoutChildren<HTMLInputAttributes> {
  type?: "checkbox";
}

export interface CheckedControlledCheckboxProps<T> extends BaseProps {
  value?: T;
  group?: never;
  checked?: boolean;
}

export interface GroupControlledCheckboxProps<T> extends BaseProps {
  value: T;
  group: T[];
  checked?: never;
}

export type CheckboxProps<T = BaseProps["value"]> =
  | CheckedControlledCheckboxProps<T>
  | GroupControlledCheckboxProps<T>;
