/* @canonical/generator-ds 0.9.1-experimental.0 */

import type { Segment } from "../../types.js";

export interface CollapsedItemsProps {
  /** Collapsed Breadcrumbs segments. */
  segments: Segment[];
  /** Whether the segment for current page is contained in the collapsed elements. */
  hasCurrent: boolean;
}
