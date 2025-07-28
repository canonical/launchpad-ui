/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";
import type { IconName } from "./iconNames.js";

export type IconProps = HTMLAttributes<HTMLElement> & {
  /** Icon name */
  name: IconName;
};
