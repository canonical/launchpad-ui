import * as v from "valibot";
import {
  SideNavigationStateSchema,
  defaultSideNavigationState,
  sideNavigationStateCookieName,
} from "./side-navigation-state.js";
import { form, getRequestEvent, query } from "$app/server";

export const getSideNavigationState = query(() => {
  const { cookies } = getRequestEvent();
  const sideNavigationCookie = cookies.get(sideNavigationStateCookieName);

  return v.is(SideNavigationStateSchema, sideNavigationCookie)
    ? sideNavigationCookie
    : defaultSideNavigationState;
});

export const setSideNavigationStateForm = form(
  v.object({
    state: SideNavigationStateSchema,
  }),
  async ({ state }) => {
    const { cookies } = getRequestEvent();

    cookies.set(sideNavigationStateCookieName, state, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });

    getSideNavigationState().set(state);
  },
);
