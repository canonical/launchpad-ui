/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { ItemContentProps } from "../common/index.js";

export interface RadioItemProps
  extends Omit<HTMLInputAttributes, "type" | "children">,
    ItemContentProps {}
