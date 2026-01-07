import * as v from "valibot";
import type { CookieDefinition } from "$lib/cookie/types.js";

export const SideNavigationStateSchema = v.picklist(["expanded", "collapsed"]);
export type SideNavigationState = v.InferInput<
  typeof SideNavigationStateSchema
>;

export const sideNavigationStateCookie = {
  name: "side-navigation-state",
  schema: SideNavigationStateSchema,
  defaultValue: "expanded",
  options: {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  },
} as const satisfies CookieDefinition<typeof SideNavigationStateSchema>;

