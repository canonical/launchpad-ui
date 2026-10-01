import type { Breadcrumbs } from "@canonical/svelte-ds-app-launchpad";
import type { ComponentProps } from "svelte";
import { resolve } from "$app/paths";
import type { RouteId, RouteParams } from "$app/types";

type Segment = ComponentProps<typeof Breadcrumbs>["segments"][number];
type PillarPageRouteId = Extract<RouteId, `/[pillar]/${string}`>;

const trails: {
  [Id in PillarPageRouteId]: (params: RouteParams<Id>) => Segment[];
} = {
  "/[pillar]/[series]": ({ pillar }) => [
    distroSegment(pillar),
    { label: "Series" },
  ],
  "/[pillar]/+source": ({ pillar }) => [
    distroSegment(pillar),
    { label: "Packages" },
  ],
  "/[pillar]/+source/[name]": ({ pillar }) => [
    distroSegment(pillar),
    packagesSegment(pillar),
    { label: "Package overview" },
  ],
  "/[pillar]/+source/[name]/[version]": ({ pillar, name }) => [
    distroSegment(pillar),
    packagesSegment(pillar),
    packageSegment(pillar, name),
    { label: "Version" },
  ],
};

export function getBreadcrumbs<Id extends PillarPageRouteId>(
  routeId: Id,
  params: RouteParams<Id>,
): Segment[] {
  const trail = trails[routeId];
  return trail(params);
}

export function isPillarPageRouteId(
  routeId: RouteId | null,
): routeId is PillarPageRouteId {
  return routeId !== null && routeId in trails;
}

function distroSegment(distro: string): Segment {
  return {
    label: distro.charAt(0).toUpperCase() + distro.slice(1),
    href: resolve("/[pillar]", { pillar: distro }),
  };
}

function packagesSegment(pillar: string): Segment {
  return {
    label: "Packages",
    href: resolve("/[pillar]/+source", { pillar }),
  };
}

function packageSegment(pillar: string, name: string): Segment {
  return {
    label: name,
    href: resolve("/[pillar]/+source/[name]", { pillar, name }),
  };
}
