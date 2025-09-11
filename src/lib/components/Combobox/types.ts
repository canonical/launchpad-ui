/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { OptionsPanelProps } from "$lib/components/common/index.js";

export interface ComboboxProps extends OptionsPanelProps {
  /**
   * Search input for the combobox content.
   */
  search: Snippet<[]>;
  /**
   * Combobox type.
   */
  type?: "multi" | "single";
  /**
   * The `name` attribute of the input elements within the combobox. This is provided on the root element instead of individual options to ensure all inputs share the same name.
   */
  inputsName: string;
}

export type ComboboxContext = {
  listBoxId: string;
  listBoxElement: HTMLDivElement | undefined;
  activeDescendant: string | null;
  setActiveDescendant: (id: string | null) => void;
  selectOption: (id: string) => void;
  listenForOptionSelect: (id: string, callback: () => void) => () => void;
  inputsName: string;
  notifyRadioChecked: (id: string) => void;
  listenForRadioCheck: (callback: (id: string) => void) => () => void;
};
