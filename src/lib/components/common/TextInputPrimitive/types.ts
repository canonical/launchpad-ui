/* @canonical/generator-ds 0.10.0-experimental.4 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

export interface TextInputPrimitiveProps
  extends WithoutChildren<HTMLInputAttributes> {
  ref?: HTMLInputElement;
  type?: "text" | "password" | "email" | "url" | "tel" | "search";
}
