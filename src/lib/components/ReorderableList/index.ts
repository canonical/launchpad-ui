import { default as ReorderableListRoot } from "./ReorderableList.svelte";
import { Item } from "./common/Item/index.js";

const ReorderableList = ReorderableListRoot as typeof ReorderableListRoot & {
  Item: typeof Item;
};

ReorderableList.Item = Item;

export { ReorderableList };
export type { ReorderableListProps } from "./types.js";
export type { ItemProps as ReorderableListItemProps } from "./common/Item/index.js";
