/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type ExpandToggleProps = {
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-label": string;
};

type BaseProps = SvelteHTMLElements["header"];

export interface SideNavigationProps extends BaseProps {
  logo: Snippet<[]>;
  expandToggle?: Snippet<[expandToggleProps: ExpandToggleProps]>;
  footer?: Snippet<[]>;
  expanded?: boolean;
}
