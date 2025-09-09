/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { CheckboxOptionProps } from "$lib/components/common/index.js";

export type CheckboxItemProps<T = HTMLInputAttributes["value"]> =
  CheckboxOptionProps<T>;
