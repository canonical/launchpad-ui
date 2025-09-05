/* @canonical/generator-ds 0.10.0-experimental.2 */

import type {
  CheckboxOptionProps,
  RadioOptionProps,
} from "$lib/components/Options/index.js";

export type ItemProps = Omit<
  RadioOptionProps & CheckboxOptionProps,
  "disabled" | "group"
>;
