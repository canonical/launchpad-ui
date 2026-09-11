import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { KeyboardGrabController } from "./utils/KeyboardGrabController.svelte.js";
import type { PointerDragController } from "./utils/PointerDragController.svelte.js";
import type { PositionInputController } from "./utils/PositionInputController.js";
import type { ReorderableList } from "./utils/ReorderableList.svelte.js";

type BaseProps = SvelteHTMLElements["ol"];

export type ReorderableListItemSnippetProps<T> = {
  item: T;
  index: number;
};

export interface ReorderableListProps<T> extends Omit<BaseProps, "children"> {
  /** Ordered list of items to render. */
  items: T[];
  /** Stable identity per item. Reordering and animations depend on it. */
  key: (item: T) => string;
  /** Human readable name of an item, used in control labels and announcements. */
  itemLabel: (item: T) => string;
  /** Render snippet for each item, receiving the current item and index. */
  item: Snippet<[ReorderableListItemSnippetProps<T>]>;
  /**
   * Disables interaction and prevents dragging or reordering.
   *
   * @default false
   **/
  disabled?: boolean;
  /**
   * Animation duration in milliseconds for reorder transitions. Ignored if the user prefers reduced motion.
   *
   * @default 200
   */
  animationDuration?: number;
}

export type ReorderableListContext<T> = {
  list: ReorderableList<T>;
  drag: PointerDragController<T>;
  grab: KeyboardGrabController<T>;
  position: PositionInputController<T>;
  key: (entry: T) => string;
  itemLabel: (entry: T) => string;
  instructionsId: string;
  children?: Snippet;
  disabled: boolean;
};
