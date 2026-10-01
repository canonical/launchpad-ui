import type { Breadcrumbs } from "@canonical/svelte-ds-app-launchpad";
import type { ComponentProps, Snippet } from "svelte";

export type BreadcrumbSegment = ComponentProps<
  typeof Breadcrumbs
>["segments"][number];

export interface PageLayoutProps {
  breadcrumbsSegments: BreadcrumbSegment[];
  children: Snippet;
}
