/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { RadioOptionProps } from "$lib/components/common/index.js";

export type RadioItemProps<T = HTMLInputAttributes["value"]> =
  RadioOptionProps<T>;
