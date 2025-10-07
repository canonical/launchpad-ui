import { isTheme } from "$lib/theme.js";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const themeCookie = cookies.get("theme");
  const theme = isTheme(themeCookie) ? themeCookie : "system";
  const sideNavigation = cookies.get("side-navigation-expanded") !== "false";

  return {
    theme,
    sideNavigation,
  };
};
