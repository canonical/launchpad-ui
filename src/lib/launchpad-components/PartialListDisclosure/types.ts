/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { ClassValue } from "svelte/elements";

export interface PartialListDisclosureProps {
  /**
   * Content of the PartialListDisclosure component.
   *
   * Snippet arguments:
   * - `listProps`: Props to spread on the list element. It contains:
   *   - `id`: The id of the list element.
   *   - `class`: The CSS class for the list element.
   * - `hiddenItemProps`: Props to spread on each item that should be hidden initially. It contains:
   *   - `class`: The CSS class for the hidden items.
   * - `toggleButtonProps`: Props to spread on the toggle button element. It contains:
   *   - `aria-controls`: The id of the list element.
   *   - `aria-expanded`: Whether the list is expanded or not.
   *   - `onclick`: An onclick handler to toggle the expanded state.
   * - `isExpanded`: A boolean indicating whether the list is expanded or not.
   */
  children: Snippet<
    [
      listProps: ListProps,
      hiddenItemProps: HiddenItemProps,
      toggleButtonProps: ToggleButtonProps,
      isExpanded: boolean,
    ]
  >;
}

export interface ListProps {
  id: string;
  class: ClassValue;
}

export interface HiddenItemProps {
  class: ClassValue;
}

export interface ToggleButtonProps {
  class: ClassValue;
  "aria-controls": string;
  "aria-expanded": boolean;
  onclick: () => void;
}
