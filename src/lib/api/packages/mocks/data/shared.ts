import type { Architecture } from "../../types.js";

export const lp = (path: string) => `https://launchpad.net${path}`;
export const dn = (path: string) => `https://downloads.example.com${path}`;

export const DEFAULT_ARCHES: Architecture[] = [
  "amd64",
  "arm64",
  "armhf",
  "ppc64el",
  "riscv64",
  "s390x",
];

export const versionSlug = (version: string): string =>
  version.replace(/[^a-zA-Z0-9]+/g, "-");

// Strip a Debian version epoch (the leading `N:`) for use in file names / URLs.
export const stripEpoch = (version: string): string =>
  version.replace(/^\d+:/, "");
