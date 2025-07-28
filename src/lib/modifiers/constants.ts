export const SEMANTIC_MODIFIERS = {
  density: ["dense"],
  severity: ["error", "information", "caution", "positive"],
} as const;

/**
 * Creates a type for an array containing possible modifier values for the
 * given categories. The entire list can also be `undefined`.
 *
 * @template T - A readonly array of keys from `SEMANTIC_MODIFIERS`.
 */
export type SemanticModifiers<
  T extends readonly (keyof typeof SEMANTIC_MODIFIERS)[],
> = (typeof SEMANTIC_MODIFIERS)[T[number]][number][] | undefined;
