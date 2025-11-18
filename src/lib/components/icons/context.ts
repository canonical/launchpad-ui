import { getContext, setContext } from "svelte";
import type { IconContext } from "./types.js";

const key = Symbol("icons");

export function setIconContext(context: IconContext) {
  setContext<IconContext>(key, context);
}

export function getIconContext() {
  return getContext<IconContext | undefined>(key);
}
