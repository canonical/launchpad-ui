/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";
import type { ModifiedBy, WithoutChildren } from "$lib/type-utils.js";
import type { IconName } from "./iconNames.js";
import type { IconModifiers } from "./modifiers";

export interface IconProps
  extends WithoutChildren<HTMLAttributes<HTMLSpanElement>>,
    ModifiedBy<IconModifiers> {
  /** Icon name */
  name: IconName;
}
