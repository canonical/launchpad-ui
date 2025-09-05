const key = Symbol("single-select-combobox");

import { getContext, setContext } from "svelte";
import type { SingleSelectComboboxContext } from "./types.js";

export function setSingleSelectComboboxContext(
  context: SingleSelectComboboxContext,
) {
  setContext(key, context);
}

export function getSingleSelectComboboxContext() {
  return getContext<SingleSelectComboboxContext | undefined>(key);
}
