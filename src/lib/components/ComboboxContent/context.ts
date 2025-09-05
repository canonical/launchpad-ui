import { getContext, setContext } from "svelte";
import type { ComboboxContentContext } from "./types.js";

const key = Symbol("combobox");

export function setComboboxContext(context: ComboboxContentContext) {
  setContext(key, context);
}

export function getComboboxContext() {
  return getContext<ComboboxContentContext | undefined>(key);
}
