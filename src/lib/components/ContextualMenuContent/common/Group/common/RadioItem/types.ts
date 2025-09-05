/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { RadioOptionProps } from "$lib/components/Options/index.js";

export type RadioItemProps<T = HTMLInputAttributes["value"]> =
  RadioOptionProps<T>;
