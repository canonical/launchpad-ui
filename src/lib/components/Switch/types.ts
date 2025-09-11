/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";

type BaseProps = Omit<
  HTMLInputAttributes,
  | "type"
  | "children"
  | "role"
  | "indeterminate"
  | "aria-checked"
  | "aria-readonly"
>;

interface CheckedControlledSwitchProps<T> extends BaseProps {
  value?: T;
  group?: never;
  checked?: boolean;
}

interface GroupControlledSwitchProps<T> extends BaseProps {
  value: T;
  group: T[];
  checked?: never;
}

export type SwitchProps<T = BaseProps["value"]> =
  | CheckedControlledSwitchProps<T>
  | GroupControlledSwitchProps<T>;
