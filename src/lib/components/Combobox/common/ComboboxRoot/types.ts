/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { PopoverProps } from "$lib/components/Popover/index.js";
import type { OptionPanelContentProps } from "$lib/components/common/index.js";

export interface ComboboxRootProps
  extends Omit<OptionPanelContentProps, "footer">,
    PopoverProps {
  /**
   * Search input for the combobox content.
   */
  search: Snippet<[]>;
  /**
   * Footer content, often used for actions related to the combobox's content.
   *
   */
  footer?: Snippet<[popovertarget: string]>;
}

export interface InternalComboboxRootProps extends ComboboxRootProps {
  type: "multi" | "single";
}

export type ComboboxContext = {
  listBoxId: string;
  listBoxElement: HTMLDivElement | undefined;
  activeDescendant: string | null;
  setActiveDescendant: (id: string | null) => void;
  selectOption: (id: string) => void;
  listenForSelect: (id: string, callback: () => void) => () => void;
};

export interface ComboboxMethods {
  showCombobox: () => void;
  hideCombobox: () => void;
  toggleCombobox: () => void;
}
