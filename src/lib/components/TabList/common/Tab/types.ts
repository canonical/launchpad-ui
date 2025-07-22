/* @canonical/generator-ds 0.9.0-experimental.22 */
import type { HTMLAnchorAttributes } from "svelte/elements";

export interface TabProps extends HTMLAnchorAttributes {
  /** Whether the tab is active */
  active?: boolean;
}
