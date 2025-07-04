import { isTheme } from "$lib/theme.js";
import type { Actions } from "./$types";

export const actions: Actions = {
  changeTheme: async ({ cookies, request }) => {
    const formData = await request.formData();
    const theme = formData.get("theme");

    if (!isTheme(theme)) return;

    cookies.set("theme", theme, {
      path: "/",
    });
  },
};
