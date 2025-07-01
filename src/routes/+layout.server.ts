import { isTheme } from "$lib/theme.js";

export const load = async ({ cookies }) => {
  const themeCookie = cookies.get("theme");
  const theme = isTheme(themeCookie) ? themeCookie : "system";

  cookies.set("theme", theme, {
    path: "/",
  });

  return {
    theme,
  };
};
