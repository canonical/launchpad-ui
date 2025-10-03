/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface NavigationProps extends BaseProps {
  desktopThreshold?: number;
  logo: Snippet<[]>;
  logoExpanded: Snippet<[]>;
  navigation: Snippet<[]>;
  footer?: Snippet<[]>;
  children: Snippet<[]>;
  expanded?: boolean;
}
