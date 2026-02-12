/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { DistributiveOmit } from "$lib/type-utils.js";
import type { ButtonPrimitiveProps } from "../../ButtonPrimitive/types.js";
import type { OptionContentProps } from "../common/index.js";

export type ButtonOptionProps = DistributiveOmit<
  ButtonPrimitiveProps,
  "children"
> &
  OptionContentProps;
