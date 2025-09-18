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
   *
   * @default "multi-select"
   */
  type?: "multi-select" | "single-select";
  /**
   * The `name` attribute of the input elements within the combobox. This is provided on the root element instead of individual options to ensure all inputs share the same name.
   */
  inputsName: string;
  /**
   * Overrides `aria-busy` on the combobox options container to indicate that the combobox is loading data, such as fetching options from an API.
   *
   * If not provided, `aria-busy` will be automatically set to `true` when a `<Combobox.Loading>` component is present within the combobox, and `false` otherwise.
   */
  "aria-busy"?: boolean;
}

export type ComboboxContext = {
  /** The listbox element, containing all options. */
  listBoxElement: HTMLDivElement | undefined;
  /** The ID of the active descendant option. */
  activeDescendant: string | null;
  /**
   * Notifies option of a given ID that it has been selected (e.g. Enter key pressed while active).
   *
   * @param id The ID of the option to select.
   */
  selectOption: (id: string) => void;
  /**
   * Registers a callback to be invoked when an option is selected via `selectOption`.
   *
   * @param id The ID of the option to listen for selection on.
   * @param callback The callback to invoke when the option is selected.
   * @returns A function to unregister the listener.
   */
  listenForOptionSelect: (id: string, callback: () => void) => () => void;
  /** The `name` attribute for all input elements within the combobox. */
  inputsName: string;
  /**
   * Notifies radio options that radio with a given ID has been checked.
   *
   * @param id The ID of the radio option that was checked.
   */
  notifyRadioChecked: (id: string) => void;
  /**
   * Registers a callback to be invoked when any radio option is checked via `notifyRadioChecked`.
   *
   * @param callback The callback to invoke when a radio option is checked, receiving the ID of the checked radio option.
   * @returns A function to unregister the listener.
   */
  listenForRadioCheck: (callback: (id: string) => void) => () => void;
  /**
   * Notifies the combobox that a loading indicator is shown.
   *
   * @returns A function to notify that the loading indicator is no longer shown.
   */
  loadingShown: () => () => void;
};
