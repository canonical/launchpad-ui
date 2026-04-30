import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * When true, only one item can be open at a time. Implemented via the
   * native `<details name>` attribute, so no JS is required to enforce it.
   *
   * In browsers without `name` support, the accordion gracefully degrades
   * to multi-open behavior.
   *
   * @default false
   */
  exclusive?: boolean;
  children?: Snippet;
}

export type AccordionContext = {
  /** Group name for exclusive mode; `undefined` when multi-open. */
  readonly name: string | undefined;
};
