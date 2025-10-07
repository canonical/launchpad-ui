/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as SideNavigationRoot } from "./SideNavigation.svelte";
import { ButtonItem, ExpandToggle, LinkItem } from "./common/index.js";

const SideNavigation = SideNavigationRoot as typeof SideNavigationRoot & {
  /**
   * `SideNavigation.ButtonItem` A clickable button item within the side navigation.
   */
  ButtonItem: typeof ButtonItem;
  /**
   * `SideNavigation.LinkItem` A navigational link item within the side navigation.
   */
  LinkItem: typeof LinkItem;
  /**
   * `SideNavigation.ExpandToggle` A button to toggle the expansion of the side navigation.
   */
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
