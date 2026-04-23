/* @canonical/generator-ds 0.10.0-experimental.4 */

import type { TextInputPrimitiveProps } from "@canonical/svelte-ds-app-launchpad/internal";
import type { MouseEventHandler } from "svelte/elements";

export interface SearchBoxProps extends Omit<
  TextInputPrimitiveProps,
  "children" | "type"
> {
  /**
   * The accessible name for the input.
   *
   * Search inputs's purpose is usually clear for sighted users, but screen reader users may not have the same context. Providing an accessible name helps ensure that all users understand the purpose of the input (see: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search#search_form_labels_and_accessibility).
   */
  "aria-label": string;
  /**
   * Click event handler for the search button.
   */
  onSearchButtonClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Whether to apply the invalid styles to the input when the input fails validation (e.g., required but empty).
   */
  invalidStyled?: boolean;
}
