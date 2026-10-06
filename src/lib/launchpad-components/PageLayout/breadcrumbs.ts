import type { BreadcrumbsSegment } from "@canonical/svelte-ds-app-launchpad";
import { resolve } from "$app/paths";

export function distroSegment(distro: string): BreadcrumbsSegment {
  return {
    label: distro.charAt(0).toUpperCase() + distro.slice(1),
    href: resolve("/[pillar]", { pillar: distro }),
  };
}

export function packagesSegment(distro: string): BreadcrumbsSegment {
  return {
    label: "Packages",
    href: resolve("/[pillar]/+source", { pillar: distro }),
  };
}

export function sourcePackageSegment(
  distro: string,
  name: string,
): BreadcrumbsSegment {
  return {
    label: name,
    href: resolve("/[pillar]/+source/[name]", { pillar: distro, name }),
  };
}
