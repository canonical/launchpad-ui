/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ButtonPrimitiveProps } from "$lib/components/common/index.js";
import type { DistributiveOmit } from "$lib/type-utils.js";

export type SortButtonProps = DistributiveOmit<
  ButtonPrimitiveProps,
  "children"
> & {
  /**
   * Label describing the sort action of the button.
   *
   * @example "Sort by Name ascending", "Sort by Name descending", "Remove sorting by Name"
   */
  "aria-label": string;
};
