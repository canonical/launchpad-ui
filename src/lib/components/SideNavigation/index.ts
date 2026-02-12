/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as SideNavigationRoot } from "./SideNavigation.svelte";
import { ExpandToggle, NavigationItem } from "./common/index.js";

const SideNavigation = SideNavigationRoot as typeof SideNavigationRoot & {
  /**
   * `SideNavigation.NavigationItem` A clickable button item within the side navigation.
   */
  NavigationItem: typeof NavigationItem;
  /**
   * `SideNavigation.ExpandToggle` A button to toggle the expansion of the side navigation.
   */
  ExpandToggle: typeof ExpandToggle;
};

SideNavigation.NavigationItem = NavigationItem;
SideNavigation.ExpandToggle = ExpandToggle;

export { SideNavigation };
export * from "./types.js";

export type { NavigationItemProps as SideNavigationItemProps } from "./common/index.js";
