/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as SideNavigationRoot } from "./SideNavigation.svelte";
import { ButtonItem, ExpandToggle, LinkItem } from "./common/index.js";

const SideNavigation = SideNavigationRoot as typeof SideNavigationRoot & {
  ButtonItem: typeof ButtonItem;
  LinkItem: typeof LinkItem;
  ExpandToggle: typeof ExpandToggle;
};

SideNavigation.ButtonItem = ButtonItem;
SideNavigation.LinkItem = LinkItem;
SideNavigation.ExpandToggle = ExpandToggle;

export { SideNavigation };
export * from "./types.js";

export type {
  ButtonItemProps as SideNavigationButtonItemProps,
  ExpandToggleProps as SideNavigationExpandToggleProps,
  LinkItemProps as SideNavigationLinkItemProps,
} from "./common/index.js";
