/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers";
import type { IconTextModifiers } from "./modifiers";

type BaseProps = SvelteHTMLElements["span"];

export interface IconTextProps
  extends BaseProps,
    ModifiedBy<IconTextModifiers> {
  icon: Snippet;
}
