/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { RadioProps } from "$lib/components/Radio/index.js";
import type { ItemContentProps } from "../common/index.js";

export type RadioItemProps<T = HTMLInputAttributes["value"]> = RadioProps<T> &
  ItemContentProps;
