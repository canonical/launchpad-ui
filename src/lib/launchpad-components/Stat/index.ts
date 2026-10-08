import StatRoot from "./Stat.svelte";
import { Item } from "./common/Item/index.js";

const Stat = StatRoot as typeof StatRoot & {
  Item: typeof Item;
};

Stat.Item = Item;

export { Stat };
export type { ItemProps as StatItemProps } from "./common/Item/index.js";
