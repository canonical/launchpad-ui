/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";

export type SwitchProps = Omit<
  HTMLInputAttributes,
  | "type"
  | "children"
  | "role"
  | "indeterminate"
  | "aria-checked"
  | "aria-readonly"
>;
