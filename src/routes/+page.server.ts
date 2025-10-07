import { isTheme } from "$lib/theme.js";
import type { Actions } from "./$types";

const aYear = 1000 * 60 * 60 * 24 * 365;

export const actions: Actions = {
  changeTheme: async ({ cookies, request }) => {
    const formData = await request.formData();
    const theme = formData.get("theme");

    if (!isTheme(theme)) return;

    cookies.set("theme", theme, {
      path: "/",
      expires: new Date(Date.now() + aYear),
    });
  },
  toggleSideNavigation: async ({ cookies, request }) => {
    const formData = await request.formData();
    const expanded = formData.get("expanded");

    if (expanded !== "true" && expanded !== "false") return;

    cookies.set("side-navigation-expanded", expanded, {
      path: "/",
      expires: new Date(Date.now() + aYear),
      httpOnly: false,
    });
  },
};
