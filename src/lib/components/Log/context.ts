import { getContext, setContext } from "svelte";
import type { LogContext } from "./types.js";

const key = Symbol("log");

export function setLogContext(context: LogContext) {
  return setContext<LogContext>(key, context);
}

export function getLogContext() {
  return getContext<LogContext | undefined>(key);
}
