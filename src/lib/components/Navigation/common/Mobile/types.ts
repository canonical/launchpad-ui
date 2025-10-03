/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["header"];

export interface MobileProps extends BaseProps {
  logo: Snippet<[]>;
}
