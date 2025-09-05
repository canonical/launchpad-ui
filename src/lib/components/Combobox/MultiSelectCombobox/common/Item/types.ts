/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { CheckedControlledCheckboxProps } from "$lib/components/Checkbox/types.js";
import type { OptionContentProps } from "$lib/components/common/index.js";

export type ItemProps<T = HTMLInputAttributes["value"]> = Omit<
  CheckedControlledCheckboxProps<T>,
  "disabled"
> &
  OptionContentProps;
