import { getContext, setContext } from "svelte";
import type { ReorderableListContext } from "./types.js";

const key = Symbol("reorderable-list");

export function setReorderableListContext<T>(
  context: ReorderableListContext<T>,
) {
  setContext(key, context);
}

export function getReorderableListContext<T>() {
  return getContext<ReorderableListContext<T> | undefined>(key);
}
