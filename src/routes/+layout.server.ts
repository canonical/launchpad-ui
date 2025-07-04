import { isTheme } from "$lib/theme.js";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const themeCookie = cookies.get("theme");
  const theme = isTheme(themeCookie) ? themeCookie : "system";

  cookies.set("theme", theme, {
    path: "/",
  });

  return {
    theme,
  };
};
