/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { MulticolorIconName } from "./iconNames.js";

export type MulticolorIconProps = {
  /** A unique identifier for the Icon */
  id?: string | undefined | null;
  /** Additional CSS classes */
  class?: string | undefined | null;
  /** Inline styles */
  style?: string | undefined | null;
  /** Icon name */
  name: MulticolorIconName;
};
