import type { Snippet } from "svelte";
import type { HTMLDetailsAttributes } from "svelte/elements";

export interface ItemProps extends Omit<HTMLDetailsAttributes, "children"> {
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
  /**
   * Whether expanded content should break out of the default content column,
   * allowing children to align with the item's grid tracks.
   *
   * @default false
   */
  contentBreakout?: boolean;
  /**
   * Content rendered inside the item when it is expanded. If the content has
   * list-like semantics, you can ensure list markers are horizontally aligned with the accordion chevron
   */
  children?: Snippet;
}
