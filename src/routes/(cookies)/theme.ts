import * as v from "valibot";
import type { CookieDefinition } from "$lib/cookie/types.js";

export const themes = ["system", "light", "dark"] as const;
export const ThemeSchema = v.picklist(themes);
export type Theme = v.InferInput<typeof ThemeSchema>;

export const themeCookie = {
  name: "theme",
  schema: ThemeSchema,
  defaultValue: "system",
  options: {
    path: "/jobs",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  },
} as const satisfies CookieDefinition<typeof ThemeSchema>;

