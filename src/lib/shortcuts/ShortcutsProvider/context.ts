const key = Symbol("shortcuts");

import { getContext, setContext } from "svelte";
import type { ShortcutsContext } from "./types.js";

export function setShortcutsContext(context: ShortcutsContext) {
  setContext(key, context);
}

export function getShortcutsContext() {
  return getContext<ShortcutsContext | undefined>(key);
}
