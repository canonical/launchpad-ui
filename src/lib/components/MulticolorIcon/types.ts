/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";
import type { MulticolorIconName } from "./iconNames.js";

export interface MulticolorIconProps
  extends WithoutChildren<HTMLAttributes<HTMLSpanElement>> {
  /** Icon name */
  name: MulticolorIconName;
}
