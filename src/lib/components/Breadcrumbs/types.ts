/* @canonical/generator-ds 0.9.1-experimental.0 */

import type { HTMLAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils";

export type Segment = {
  label: string;
  href?: string;
};

export interface BreadcrumbsProps
  extends WithoutChildren<HTMLAttributes<HTMLElement>> {
  /**
   * Breadcrumb segments.
   */
  segments: Segment[];
  /**
   * Controls how the segments are collapsed if there are too many to fit in the available space.
   * - `"all"`: All segments can be collapsed.
   * - `"none"`: Segments are never collapsed.
   * - `number`: The number of segments (from the start) that are allowed to be collapsed.
   */
  collapse?: "all" | "none" | number;
}
