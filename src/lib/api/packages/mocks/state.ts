// Per-process mutable state for mock writes. Tests must call
// `resetMockState()` between cases so write-order doesn't leak.

import type { PackagesViewsPreference } from "../types.js";

const DEFAULT_PACKAGES_VIEWS: PackagesViewsPreference = {
  defaultTabs: ["all", "my-uploads", "latest-uploads"],
  myTeams: ["ubuntu-server"],
};

let packagesViews: PackagesViewsPreference = { ...DEFAULT_PACKAGES_VIEWS };

export const getPackagesViews = (): PackagesViewsPreference => ({
  defaultTabs: [...packagesViews.defaultTabs],
  myTeams: [...packagesViews.myTeams],
});

export const setPackagesViews = (
  next: PackagesViewsPreference,
): PackagesViewsPreference => {
  packagesViews = {
    defaultTabs: [...next.defaultTabs],
    myTeams: [...next.myTeams],
  };
  return getPackagesViews();
};

export const resetMockState = (): void => {
  packagesViews = { ...DEFAULT_PACKAGES_VIEWS };
};
