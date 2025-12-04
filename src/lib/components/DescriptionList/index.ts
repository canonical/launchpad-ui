/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as DescriptionListRoot } from "./DescriptionList.svelte";
import { Item } from "./common/index.js";

const DescriptionList = DescriptionListRoot as typeof DescriptionListRoot & {
  /**
   * The `DescriptionList.Item` component represents an individual term and its corresponding description within a `DescriptionList`.
   *
   * @example
   * ```svelte
   * <DescriptionList>
   *   <DescriptionList.Item term="ID">134</DescriptionList.Item>
   * </DescriptionList>
   */
  Item: typeof Item;
};
DescriptionList.Item = Item;

export { DescriptionList };
export { type DescriptionListProps } from "./types.js";
export type { ItemProps as DescriptionListItemProps } from "./common/index.js";
