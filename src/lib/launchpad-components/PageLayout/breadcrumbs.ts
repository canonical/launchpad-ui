import type { BreadcrumbSegment } from "./types.js";
import { resolve } from "$app/paths";

export function distroSegment(distro: string): BreadcrumbSegment {
  return {
    label: distro.charAt(0).toUpperCase() + distro.slice(1),
    href: resolve("/[pillar]", { pillar: distro }),
  };
}

export function packagesSegment(distro: string): BreadcrumbSegment {
  return {
    label: "Packages",
    href: resolve("/[pillar]/+source", { pillar: distro }),
  };
}

export function packageSegment(
  distro: string,
  name: string,
): BreadcrumbSegment {
  return {
    label: name,
    href: resolve("/[pillar]/+source/[name]", { pillar: distro, name }),
  };
}
