/* @canonical/generator-ds 0.10.0-experimental.0 */

import { default as ContextualMenuContentRoot } from "./ContextualMenuContent.svelte";
import {
  ButtonItem,
  CheckboxItem,
  Group,
  Helper,
  RadioItem,
  SwitchItem,
} from "./common/index.js";

const ContextualMenuContent =
  ContextualMenuContentRoot as typeof ContextualMenuContentRoot & {
    Helper: typeof Helper;
    Group: typeof Group;
    ButtonItem: typeof ButtonItem;
    CheckboxItem: typeof CheckboxItem;
    RadioItem: typeof RadioItem;
    SwitchItem: typeof SwitchItem;
  };

ContextualMenuContent.Helper = Helper;
ContextualMenuContent.Group = Group;
ContextualMenuContent.ButtonItem = ButtonItem;
ContextualMenuContent.CheckboxItem = CheckboxItem;
ContextualMenuContent.RadioItem = RadioItem;
ContextualMenuContent.SwitchItem = SwitchItem;

export { ContextualMenuContent };
export * from "./types.js";
export type {
  ButtonItemProps as ContextualMenuContentButtonItemProps,
  CheckboxItemProps as ContextualMenuContentCheckboxItemProps,
  GroupProps as ContextualMenuContentGroupProps,
  HelperProps as ContextualMenuContentHelperProps,
  RadioItemProps as ContextualMenuContentRadioItemProps,
  SwitchItemProps as ContextualMenuContentSwitchItemProps,
} from "./common/index.js";
