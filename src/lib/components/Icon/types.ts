/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";
import type { IconName } from "./iconNames.js";

export interface IconProps
  extends WithoutChildren<HTMLAttributes<HTMLSpanElement>> {
  /** Icon name */
  name: IconName;
}
