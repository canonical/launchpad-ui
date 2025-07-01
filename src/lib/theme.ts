export const themes = ["system", "light", "dark"] as const;
export type Theme = (typeof themes)[number];
export function isTheme(value: unknown): value is Theme {
  return themes.includes(value as Theme);
}
