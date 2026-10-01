import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export interface DescriptionProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> {
  children?: Snippet;
}
