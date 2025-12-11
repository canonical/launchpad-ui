/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { CheckedControlledRadioProps } from "$lib/components/Radio/index.js";
import type { OptionContentProps } from "$lib/components/common/index.js";

export interface RadioOptionProps<T = HTMLInputAttributes["value"]>
  extends
    Omit<CheckedControlledRadioProps<T>, "disabled" | "name" | "group">,
    OptionContentProps {}
