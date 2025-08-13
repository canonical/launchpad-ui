/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";

type BaseProps = Omit<
  HTMLInputAttributes,
  "type" | "children" | "indeterminate"
>;

interface CheckedControlledRadioProps<T> extends BaseProps {
  value?: T;
  group?: never;
}

interface GroupControlledRadioProps<T> extends Omit<BaseProps, "checked"> {
  value: T;
  group: T;
}

export type RadioProps<T = BaseProps["value"]> =
  | CheckedControlledRadioProps<T>
  | GroupControlledRadioProps<T>;
