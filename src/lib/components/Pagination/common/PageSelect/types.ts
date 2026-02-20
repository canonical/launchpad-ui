/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { SelectProps } from "$lib/components/Select/index.js";

export interface PageSelectProps extends Omit<
  SelectProps,
  "multiple" | "ref" | "severity" | "density"
> {
  totalPages: number;
}
