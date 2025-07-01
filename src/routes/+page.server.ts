import { isTheme } from "$lib/theme.js";

export const actions = {
  changeTheme: async ({ cookies, request }) => {
    const formData = await request.formData();
    const theme = formData.get("theme");

    if (!isTheme(theme)) return;

    cookies.set("theme", theme, {
      path: "/",
    });
  },
};
