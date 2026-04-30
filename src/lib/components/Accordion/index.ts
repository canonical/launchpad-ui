import { default as AccordionRoot } from "./Accordion.svelte";
import { Item } from "./common/Item/index.js";

const Accordion = AccordionRoot as typeof AccordionRoot & {
  /**
   * `Accordion.Item` is a single collapsible section, rendered as a
   * native `<details>` element with a `<summary>` header.
   *
   * @example
   * ```svelte
   * <Accordion.Item open heading="Section title">
   *   Body content
   * </Accordion.Item>
   * ```
   */
  Item: typeof Item;
};

Accordion.Item = Item;

export { Accordion };
export type { AccordionProps } from "./types.js";
export type { ItemProps as AccordionItemProps } from "./common/Item/index.js";
