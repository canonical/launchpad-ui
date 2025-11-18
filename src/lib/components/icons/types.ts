import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { SvelteSet } from "svelte/reactivity";
import type { WithoutChildren } from "$lib/type-utils.js";

export type IconProps = WithoutChildren<SvelteHTMLElements["svg"]>;
export interface BaseIconProps extends IconProps {
  iconName: string;
  children: Snippet<[]>;
  defs?: Snippet<[]>;
}

export interface IconContext {
  registry: SvelteSet<string>;
}
