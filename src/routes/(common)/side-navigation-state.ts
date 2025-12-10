import * as v from "valibot";

export const sideNavigationStateCookieName = "side-navigation-state";
export const SideNavigationStateSchema = v.picklist(["expanded", "collapsed"]);
export type SideNavigationState = v.InferInput<
  typeof SideNavigationStateSchema
>;
export const defaultSideNavigationState =
  "expanded" satisfies SideNavigationState;
