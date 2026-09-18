import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { ItemData } from "./common/Item/types.js";
import type {
  DragController,
  KeyboardController,
  PositionInputController,
  ReorderableList,
} from "./utils/index.js";

type BaseProps = SvelteHTMLElements["ol"];

export type DragMode = "preview" | "drop-indicator";

export interface ReorderableListProps<T> extends Omit<BaseProps, "children"> {
  /** Ordered list of items to render. */
  items: T[];
  /** Stable identity per item. Reordering and animations depend on it. */
  key: (item: T) => string;
  /** Human readable name of an item, used in control labels and announcements. */
  itemLabel: (item: T) => string;
  /** Render snippet for each item, receiving:
   * - `itemData`: The data for the current item, including `item` and `index`.
   * - `renderedInOverlay`: `true` if the item is rendered in the drag overlay, `false` otherwise.
   */
  item: Snippet<[itemData: ItemData<T>, renderedInOverlay: boolean]>;
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
  /**
   * Controls how pointer dragging communicates the potential drop position.
   * - "preview" previews the reordered rows.
   * - "drop-indicator" keeps rows in place and marks the insertion edge.
   *
   * Does not affect keyboard moves.
   *
   * @default "preview"
   */
  dragMode?: DragMode;
}

export type ReorderableListContext<T> = {
  list: ReorderableList<T>;
  drag: DragController<T>;
  keyboard: KeyboardController<T>;
  position: PositionInputController<T>;
  key: (entry: T) => string;
  itemLabel: (entry: T) => string;
  disabled: boolean;
  /** ID for the list instructions element. */
  instructionsId: string;
};
