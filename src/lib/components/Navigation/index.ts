/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as NavigationRoot } from "./Navigation.svelte";
import { ButtonItem, LinkItem } from "./common/index.js";

const Navigation = NavigationRoot as typeof NavigationRoot & {
  ButtonItem: typeof ButtonItem;
  LinkItem: typeof LinkItem;
};

Navigation.ButtonItem = ButtonItem;
Navigation.LinkItem = LinkItem;

export { Navigation };
export * from "./types.js";

export type {
  ButtonItemProps as NavigationButtonItemProps,
  LinkItemProps as NavigationLinkItemProps,
} from "./common/index.js";
