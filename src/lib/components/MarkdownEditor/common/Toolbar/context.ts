import { getContext, setContext } from "svelte";
import type { MarkdownEditorToolbarContext } from "./types.js";

const key = Symbol("markdown-editor-toolbar");

export function setMarkdownEditorToolbarContext(
  context: MarkdownEditorToolbarContext,
) {
  setContext(key, context);
}

export function getMarkdownEditorToolbarContext() {
  return getContext<MarkdownEditorToolbarContext | undefined>(key);
}
