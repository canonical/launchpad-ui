/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ButtonPrimitiveProps } from "@canonical/svelte-ds-app-launchpad/internal";
import type { DistributiveOmit } from "$lib/type-utils.js";

export type PageNavigationProps = DistributiveOmit<
  ButtonPrimitiveProps,
  "children"
> & {
  direction: "first" | "previous" | "next" | "last";
};
