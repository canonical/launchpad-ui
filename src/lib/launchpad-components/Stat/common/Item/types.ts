import type { HTMLAttributes } from "svelte/elements";

export type ItemProps = HTMLAttributes<HTMLElement> & {
  key: string;
};
