/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { IconName } from "./iconNames.js";

export type IconProps = {
  /** A unique identifier for the Icon */
  id?: string | undefined | null;
  /** Additional CSS classes */
  class?: string | undefined | null;
  /** Inline styles */
  style?: string | undefined | null;
  /** Icon name */
  name: IconName;
};
