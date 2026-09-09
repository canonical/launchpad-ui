import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["ol"];

export interface ReorderableListProps<T> extends Omit<BaseProps, "children"> {
  /** Ordered list of items to render. */
  items: T[];
  /** Stable identity per item. Reordering and animations depend on it. */
  key: (item: T) => string;
  /** Human readable name of an item, used in control labels and announcements. */
  itemLabel: (item: T) => string;
  /** Render snippet for each item, receiving the current item as its argument. */
  item: Snippet<[T]>;
  /** Render snippet for extra content per item, receiving the current item as its argument. */
  extraContent?: Snippet<[T]>;
  /** Disables interaction and prevents dragging or reordering. */
  disabled?: boolean;
  /** Animation duration in milliseconds for reorder transitions. */
  duration?: number;
}
