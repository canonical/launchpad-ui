// Pure, framework-agnostic helpers for ActiveViewsList. Kept side-effect free
// so the same logic works on both client and server and is testable.

export type ActiveViewsListItem = {
  /** Opaque identifier for the item. */
  id: string;
  text: string;
};

export const isSelected = (
  items: readonly ActiveViewsListItem[],
  id: string,
): boolean => items.some((item) => item.id === id);

/** Append `item` unless an entry with the same id already exists. */
export const addItem = (
  items: readonly ActiveViewsListItem[],
  item: ActiveViewsListItem,
): ActiveViewsListItem[] =>
  isSelected(items, item.id) ? [...items] : [...items, item];

export const removeItem = (
  items: readonly ActiveViewsListItem[],
  id: string,
): ActiveViewsListItem[] => items.filter((item) => item.id !== id);

/** Add `item` when absent, remove it when present. */
export const toggleItem = (
  items: readonly ActiveViewsListItem[],
  item: ActiveViewsListItem,
): ActiveViewsListItem[] =>
  isSelected(items, item.id)
    ? removeItem(items, item.id)
    : addItem(items, item);

/**
 * Reorder `items` to follow `orderedIds`. Unknown ids are ignored and any items
 * not named in `orderedIds` are appended in their original order, so a partial
 * or stale id list can never drop entries.
 */
export const orderItems = (
  items: readonly ActiveViewsListItem[],
  orderedIds: readonly string[],
): ActiveViewsListItem[] => {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: ActiveViewsListItem[] = [];
  for (const id of orderedIds) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }
  for (const item of items) {
    if (byId.has(item.id)) ordered.push(item);
  }
  return ordered;
};

/** Move the item at index `from` to index `to` (drag reordering). */
export const moveItem = (
  items: readonly ActiveViewsListItem[],
  from: number,
  to: number,
): ActiveViewsListItem[] => {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return [...items];
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};
