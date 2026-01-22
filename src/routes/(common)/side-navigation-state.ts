import * as v from "valibot";

export const sideNavigationStateCookieName = "side-navigation-state";
export const SideNavigationStateSchema = v.fallback(
  v.picklist(["expanded", "collapsed"]),
  "expanded",
);
