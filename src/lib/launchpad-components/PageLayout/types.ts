import type { Segment } from "@canonical/svelte-ds-app-launchpad";
import type { Snippet } from "svelte";

export interface PageLayoutProps {
  breadcrumbsSegments: Segment[];
  children: Snippet;
}
