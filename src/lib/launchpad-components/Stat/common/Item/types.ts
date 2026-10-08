import type { SvelteHTMLElements } from "svelte/elements";

export type ItemProps = Omit<SvelteHTMLElements["div"], "children"> & {
  term: string;
  description: string;
  marked?: boolean;
};
