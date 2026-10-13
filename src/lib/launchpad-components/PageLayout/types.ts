import type { BreadcrumbsSegment } from "@canonical/svelte-ds-app-launchpad";
import type { Snippet } from "svelte";

export interface PageLayoutProps {
  breadcrumbsSegments?: BreadcrumbsSegment[];
  children: Snippet;
}
