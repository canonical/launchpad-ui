/* @canonical/generator-ds 0.9.1-experimental.0 */

import type { Segment } from "../../../types.js";

export interface ItemProps {
  segment: Segment;
  /** Indicates whether this segment represents the current page */
  current?: boolean;
}
