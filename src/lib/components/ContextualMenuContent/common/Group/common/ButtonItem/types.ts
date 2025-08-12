/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLButtonAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";
import type { ItemContentProps } from "../common/index.js";

export interface ButtonItemProps
  extends WithoutChildren<HTMLButtonAttributes>,
    ItemContentProps {}
