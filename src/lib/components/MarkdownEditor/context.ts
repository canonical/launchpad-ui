import { getContext, setContext } from "svelte";
import type { MarkdownEditorContext } from "./types.js";

const key = Symbol("markdown-editor");

export function setMarkdownEditorContext(context: MarkdownEditorContext) {
  setContext(key, context);
}

export function getMarkdownEditorContext() {
  return getContext<MarkdownEditorContext | undefined>(key);
}
