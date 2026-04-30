import { getContext, setContext } from "svelte";
import type { AccordionContext } from "./types.js";

const key = Symbol("accordion");

export function setAccordionContext(context: AccordionContext) {
  setContext(key, context);
}

export function getAccordionContext() {
  return getContext<AccordionContext | undefined>(key);
}
