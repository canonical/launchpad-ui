import type { SvelteHTMLElements } from "svelte/elements";
import type { ReorderableListItemSnippetProps } from "../../types.js";

type BaseProps = SvelteHTMLElements["div"];

export interface ItemProps<T>
  extends BaseProps, ReorderableListItemSnippetProps<T> {}
