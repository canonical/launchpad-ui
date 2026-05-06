/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { ClassValue } from "svelte/elements";

export interface CommandListProps {
  children?: Snippet<[]>;
  class?: ClassValue;
}
