/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { IconProps } from "$lib/components/Icon/index.js";
import type { ModifiedBy } from "$lib/type-utils.js";
import type { IconMarkerModifiers } from "./modifiers.js";

export interface IconMarkerProps
  extends IconProps,
    // TODO(@Goulin): What's the best approach to ensure that it is either `small` or `large` and never default (not-modified).
    ModifiedBy<IconMarkerModifiers> {}
