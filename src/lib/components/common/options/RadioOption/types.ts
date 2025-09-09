/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { RadioProps } from "$lib/components/Radio/index.js";
import type { OptionContentProps } from "../common/index.js";

export type RadioOptionProps<T = HTMLInputAttributes["value"]> = RadioProps<T> &
  OptionContentProps;
