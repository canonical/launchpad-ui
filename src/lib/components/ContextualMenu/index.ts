/* @canonical/generator-ds 0.10.0-experimental.0 */

import { default as ContextualMenuRoot } from "./ContextualMenu.svelte";
import {
  ButtonItem,
  CheckboxItem,
  Group,
  Helper,
  LinkItem,
  RadioItem,
  SwitchItem,
} from "./common/index.js";

const ContextualMenu = ContextualMenuRoot as typeof ContextualMenuRoot & {
  Helper: typeof Helper;
  Group: typeof Group;
  ButtonItem: typeof ButtonItem;
  CheckboxItem: typeof CheckboxItem;
  LinkItem: typeof LinkItem;
  RadioItem: typeof RadioItem;
  SwitchItem: typeof SwitchItem;
};

ContextualMenu.Helper = Helper;
ContextualMenu.Group = Group;
ContextualMenu.ButtonItem = ButtonItem;
ContextualMenu.CheckboxItem = CheckboxItem;
ContextualMenu.LinkItem = LinkItem;
ContextualMenu.RadioItem = RadioItem;
ContextualMenu.SwitchItem = SwitchItem;

export { ContextualMenu };
export * from "./types.js";
export type {
  ButtonItemProps,
  CheckboxItemProps,
  GroupProps,
  HelperProps,
  LinkItemProps,
  RadioItemProps,
  SwitchItemProps,
} from "./common/index.js";
