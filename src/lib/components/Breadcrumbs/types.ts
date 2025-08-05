/* @canonical/generator-ds 0.9.1-experimental.0 */

import type { HTMLAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils";

export interface Segment {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps
  extends WithoutChildren<HTMLAttributes<HTMLElement>> {
  /**
   * Breadcrumb segments.
   */
  segments: Segment[];
  /**
   * The number of segments to keep expanded (from the end).
   * If set to `all` or a number greater or equal to the total number of segments, no segments will be collapsed.
   *
   * @default 1
   */
  keepExpanded?: "all" | number;
}

export interface PossiblyHiddenSegment extends Segment {
  hidden?: boolean;
}
