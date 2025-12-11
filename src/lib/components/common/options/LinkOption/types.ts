/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLAnchorAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";
import type { OptionContentProps } from "../common/index.js";

export interface LinkOptionProps
  extends WithoutChildren<HTMLAnchorAttributes>, OptionContentProps {
  disabled?: boolean;
}
