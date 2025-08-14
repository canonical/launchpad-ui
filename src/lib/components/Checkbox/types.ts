/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";

type BaseProps = Omit<HTMLInputAttributes, "type" | "children">;

interface CheckedControlledCheckboxProps<T> extends BaseProps {
  value?: T;
  group?: never;
  checked?: boolean;
}

interface GroupControlledCheckboxProps<T> extends BaseProps {
  value: T;
  group: T[];
  checked?: never;
}

export type CheckboxProps<T = BaseProps["value"]> =
  | CheckedControlledCheckboxProps<T>
  | GroupControlledCheckboxProps<T>;
