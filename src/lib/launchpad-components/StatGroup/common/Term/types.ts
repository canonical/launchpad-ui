import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export interface TermProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> {
  children?: Snippet;
}
