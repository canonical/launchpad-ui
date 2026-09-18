import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface ItemData<T> {
  item: T;
  index: number;
}

export interface ItemProps<T> extends BaseProps, ItemData<T> {}
