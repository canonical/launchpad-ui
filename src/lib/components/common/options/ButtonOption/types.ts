/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { ButtonPrimitiveProps } from "@canonical/svelte-ds-app-launchpad/internal";
import type { DistributiveOmit } from "$lib/type-utils.js";
import type { OptionContentProps } from "../common/index.js";

export type ButtonOptionProps = DistributiveOmit<
  ButtonPrimitiveProps,
  "children"
> &
  OptionContentProps;
