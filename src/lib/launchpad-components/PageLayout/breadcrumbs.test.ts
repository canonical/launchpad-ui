import { describe, expect, it } from "vitest";
import {
  distroSegment,
  packageSegment,
  packagesSegment,
} from "./breadcrumbs.js";

describe("breadcrumb segments", () => {
  it.each([
    { distro: "ubuntu", segment: { label: "Ubuntu", href: "/ubuntu" } },
    { distro: "debian", segment: { label: "Debian", href: "/debian" } },
  ])("links the capitalized $distro distro", ({ distro, segment }) => {
    expect(distroSegment(distro)).toEqual(segment);
  });

  it("links the distro's packages", () => {
    expect(packagesSegment("ubuntu")).toEqual({
      label: "Packages",
      href: "/ubuntu/+source",
    });
  });

  it("links a package by name", () => {
    expect(packageSegment("ubuntu", "libreoffice")).toEqual({
      label: "libreoffice",
      href: "/ubuntu/+source/libreoffice",
    });
  });
});
