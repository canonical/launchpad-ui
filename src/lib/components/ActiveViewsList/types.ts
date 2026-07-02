import type { SvelteHTMLElements } from "svelte/elements";
import type { ActiveViewsListItem } from "./activeViewsListState.js";

type BaseProps = SvelteHTMLElements["section"];

export interface ActiveViewsListProps extends BaseProps {
  /** The ordered list of active views to display. */
  items: ActiveViewsListItem[];
  /** The form action URL for remove/reorder submissions. If omitted, the list works purely client-side. */
  action?: string;
  /** Accessible heading for the list section. */
  label?: string;
  /** Text shown when the list is empty. */
  emptyText?: string;
  /** Called with the new order after a drag-and-drop reorder completes. */
  onreorder?: (items: ActiveViewsListItem[]) => void;
  /** Called when an item is removed. */
  onremove?: (id: string) => void;
}
