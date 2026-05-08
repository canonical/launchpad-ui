import { default as AccordionRoot } from "./Accordion.svelte";
import { Item } from "./common/Item/index.js";

const Accordion = AccordionRoot as typeof AccordionRoot & {
  /**
   * `Accordion.Item` is a single collapsible section rendered as a native `<details>` element. Its `<summary>` is keyboard-focusable and exposed as a button with `expanded` state in the accessibility tree, free of charge.
   *
   * When nested inside an `<Accordion exclusive>`, opening one item closes its siblings via the native `<details name>` mechanism. When inside any `<Accordion>`, ArrowUp/ArrowDown/Home/End move focus between item headers (WAI-ARIA Accordion Pattern).
   *
   * ## Example Usage
   * ```svelte
   * <Accordion.Item bind:open heading="Section title">
   *   Body content
   * </Accordion.Item>
   * ```
   *
   * For a heading with rich markup (icons, badges, multiple elements), pass a snippet instead:
   * ```svelte
   * <Accordion.Item>
   *   {#snippet heading()}
   *     <strong>Section</strong> title <Badge>3</Badge>
   *   {/snippet}
   *   Body content
   * </Accordion.Item>
   */
  Item: typeof Item;
};

Accordion.Item = Item;

export { Accordion };
export type { AccordionProps } from "./types.js";
export type { ItemProps as AccordionItemProps } from "./common/Item/index.js";
