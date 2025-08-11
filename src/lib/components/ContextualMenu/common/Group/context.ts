import { getContext, setContext } from "svelte";
import type { GroupContext } from "./types.js";

const key = Symbol("group");

export function setGroupContext(context: GroupContext) {
  setContext(key, context);
}

export function getGroupContext() {
  return getContext<GroupContext | undefined>(key);
}
