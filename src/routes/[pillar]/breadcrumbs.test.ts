import { describe, expect, it } from "vitest";
import { getBreadcrumbs, isPillarPageRouteId } from "./breadcrumbs.js";

describe("pillar breadcrumbs", () => {
  it.each([
    {
      routeId: "/[pillar]/[series]" as const,
      params: { pillar: "ubuntu", series: "resolute" },
      segments: [{ label: "Ubuntu", href: "/ubuntu" }, { label: "Series" }],
    },
    {
      routeId: "/[pillar]/+source" as const,
      params: { pillar: "ubuntu" },
      segments: [{ label: "Ubuntu", href: "/ubuntu" }, { label: "Packages" }],
    },
    {
      routeId: "/[pillar]/+source/[name]" as const,
      params: { pillar: "ubuntu", name: "libreoffice" },
      segments: [
        { label: "Ubuntu", href: "/ubuntu" },
        { label: "Packages", href: "/ubuntu/+source" },
        { label: "Package overview" },
      ],
    },
    {
      routeId: "/[pillar]/+source/[name]/[version]" as const,
      params: { pillar: "ubuntu", name: "libreoffice", version: "4:24.2.0" },
      segments: [
        { label: "Ubuntu", href: "/ubuntu" },
        { label: "Packages", href: "/ubuntu/+source" },
        { label: "libreoffice", href: "/ubuntu/+source/libreoffice" },
        { label: "Version" },
      ],
    },
  ])("follows the trail for $routeId", ({ routeId, params, segments }) => {
    expect(getBreadcrumbs(routeId, params)).toEqual(segments);
  });

  it("capitalizes the distro segment", () => {
    expect(
      getBreadcrumbs("/[pillar]/+source", { pillar: "debian" })[0],
    ).toEqual({ label: "Debian", href: "/debian" });
  });

  it.each([null, "/[pillar]" as const])("has no trail for %s", (routeId) => {
    expect(isPillarPageRouteId(routeId)).toBe(false);
  });

  it.each([
    "/[pillar]/[series]" as const,
    "/[pillar]/+source" as const,
    "/[pillar]/+source/[name]" as const,
    "/[pillar]/+source/[name]/[version]" as const,
  ])("has a trail for %s", (routeId) => {
    expect(isPillarPageRouteId(routeId)).toBe(true);
  });
});
