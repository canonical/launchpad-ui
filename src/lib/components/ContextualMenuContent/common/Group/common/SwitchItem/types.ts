/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { SwitchOptionProps } from "$lib/components/common/index.js";

export type SwitchItemProps<T = HTMLInputAttributes["value"]> =
  SwitchOptionProps<T>;
