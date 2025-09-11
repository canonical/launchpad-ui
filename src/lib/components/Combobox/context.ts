import { getContext, setContext } from "svelte";
import type { ComboboxContext } from "./types.js";

const key = Symbol("combobox");

export function setComboboxContext(context: ComboboxContext) {
  setContext(key, context);
}

export function getComboboxContext() {
  return getContext<ComboboxContext | undefined>(key);
}
