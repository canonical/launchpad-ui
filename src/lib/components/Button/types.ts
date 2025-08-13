/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { ModifiedBy } from "$lib/type-utils";
import type { ButtonModifiers } from "./modifiers";

type BaseProps = SvelteHTMLElements["button"];

export interface ButtonProps extends BaseProps, ModifiedBy<ButtonModifiers> {
  iconLeft?: Snippet;
  iconRight?: Snippet;
  loading?: boolean;
}
