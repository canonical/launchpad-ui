import * as v from "valibot";

export const themeCookieName = "theme";
export const themes = ["system", "light", "dark"] as const;
export const ThemeSchema = v.picklist(themes);
export type Theme = v.InferInput<typeof ThemeSchema>;
export const defaultTheme = "system" satisfies Theme;
