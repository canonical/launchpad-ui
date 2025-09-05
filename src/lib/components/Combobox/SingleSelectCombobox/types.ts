import type { ComboboxRootProps } from "../common/index.js";

export interface SingleSelectComboboxProps extends ComboboxRootProps {
  /**
   * The `name` attribute of the input elements within the combobox. This is provided on the root element instead of individual options to ensure all inputs share the same name.
   */
  inputsName: string;
}

export interface SingleSelectComboboxContext {
  inputsName: string;
  selectedItemId: string | null;
}
