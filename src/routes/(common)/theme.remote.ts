import * as v from "valibot";
import type { Theme } from "$lib/theme.js";
import { ThemeSchema, defaultTheme, themeCookieName } from "$lib/theme.js";
import { command, form, getRequestEvent, query } from "$app/server";

export const getTheme = query(() => {
  const { cookies } = getRequestEvent();
  const themeCookie = cookies.get(themeCookieName);

  return v.is(ThemeSchema, themeCookie) ? themeCookie : defaultTheme;
});

export const setThemeForm = form(
  v.object({
    theme: ThemeSchema,
  }),
  ({ theme }) => setTheme(theme),
);

export const setThemeCommand = command(ThemeSchema, (theme) => setTheme(theme));

const setTheme = (theme: Theme) => {
  const { cookies } = getRequestEvent();

  cookies.set(themeCookieName, theme, {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });

  getTheme().set(theme);
};
