/* @canonical/generator-ds 0.10.0-experimental.0 */

import { default as ContextualMenuContentRoot } from "./ContextualMenuContent.svelte";
import {
  ButtonItem,
  CheckboxItem,
  Group,
  Helper,
  LinkItem,
  RadioItem,
  SwitchItem,
} from "./common/index.js";

const ContextualMenuContent =
  ContextualMenuContentRoot as typeof ContextualMenuContentRoot & {
    Helper: typeof Helper;
    Group: typeof Group;
    ButtonItem: typeof ButtonItem;
    CheckboxItem: typeof CheckboxItem;
    LinkItem: typeof LinkItem;
    RadioItem: typeof RadioItem;
    SwitchItem: typeof SwitchItem;
  };

ContextualMenuContent.Helper = Helper;
ContextualMenuContent.Group = Group;
ContextualMenuContent.ButtonItem = ButtonItem;
ContextualMenuContent.CheckboxItem = CheckboxItem;
ContextualMenuContent.LinkItem = LinkItem;
ContextualMenuContent.RadioItem = RadioItem;
ContextualMenuContent.SwitchItem = SwitchItem;

export { ContextualMenuContent };
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
