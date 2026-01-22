import * as v from "valibot";

export const themeCookieName = "theme";
export const themes = ["system", "light", "dark"] as const;
export const ThemeSchema = v.fallback(v.picklist(themes), "system");
export type Theme = v.InferInput<typeof ThemeSchema>;
