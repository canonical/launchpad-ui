/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";

type BaseProps = Omit<
  HTMLInputAttributes,
  "type" | "children" | "indeterminate"
>;

export interface CheckedControlledRadioProps<T> extends BaseProps {
  value?: T;
  group?: never;
  checked?: boolean;
}

export interface GroupControlledRadioProps<T> extends BaseProps {
  value: T;
  group: T;
  checked?: never;
}

export type RadioProps<T = BaseProps["value"]> =
  | CheckedControlledRadioProps<T>
  | GroupControlledRadioProps<T>;
