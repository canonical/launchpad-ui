import { getContext, setContext } from "svelte";
import type { DescriptionListContext } from "./types.js";

const key = Symbol("description-list");

export function setDescriptionListContext(context: DescriptionListContext) {
  setContext(key, context);
}

export function getDescriptionListContext() {
  return getContext<DescriptionListContext | undefined>(key);
}
