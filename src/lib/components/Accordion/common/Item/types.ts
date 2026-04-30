import type { Snippet } from "svelte";
import type { HTMLDetailsAttributes } from "svelte/elements";

export interface ItemProps extends Omit<
  HTMLDetailsAttributes,
  "children" | "name"
> {
  /**
   * Whether the item is open.
   *
   * **@bindable**
   *
   * @default false
   */
  open?: boolean;
  /**
   * Content rendered inside the `<summary>` heading. Pass a string for
   * plain text, or a snippet when the heading needs richer markup (icons,
   * badges, multiple elements).
   */
  heading?: Snippet | string;
  children?: Snippet;
}
