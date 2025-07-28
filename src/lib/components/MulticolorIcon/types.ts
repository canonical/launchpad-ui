/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";
import type { MulticolorIconName } from "./iconNames.js";

export type MulticolorIconProps = HTMLAttributes<HTMLElement> & {
  /** Icon name */
  name: MulticolorIconName;
};
