/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { SwitchProps } from "$lib/components/Switch/types.js";
import type { ItemContentProps } from "../common/index.js";

export type SwitchItemProps<T = HTMLInputAttributes["value"]> = SwitchProps<T> &
  ItemContentProps;
