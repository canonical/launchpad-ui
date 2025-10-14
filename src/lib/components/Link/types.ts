/* @canonical/generator-ds 0.10.0-experimental.4 */

import type { HTMLAnchorAttributes } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers/index.js";
import type { LinkModifiers } from "./modifiers/index.js";

export interface LinkProps
  extends HTMLAnchorAttributes,
    ModifiedBy<LinkModifiers> {}
