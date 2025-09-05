/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { TextInputProps } from "$lib/components/TextInput/index.js";

export interface SearchProps extends Omit<TextInputProps, "type"> {
  /**
   * Label for the combobox, describing its purpose.
   *
   */
  label: string;
}
