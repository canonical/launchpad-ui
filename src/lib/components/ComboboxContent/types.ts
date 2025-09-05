/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { OptionsPanelProps } from "$lib/components/Options/index.js";

type ComboboxContentType = "multi" | "single";

export interface ComboboxContentProps extends OptionsPanelProps {
  /**
   * The type of the combobox.
   * - "multi": Allows multiple selections (checkboxes).
   * - "single": Allows a single selection (radio buttons).
   *
   * @default "multi"
   */
  type?: ComboboxContentType;
  /**
   * Search input for the combobox content. It is highly recommended to use `ComboboxContent.Search` component.
   */
  search: Snippet<[]>;
}

export type ComboboxContentContext = {
  type: ComboboxContentType;
  listBoxId: string;
  listBoxElement: HTMLDivElement | undefined;
  activeDescendant: string | null;
  setActiveDescendant: (id: string | null) => void;
};
