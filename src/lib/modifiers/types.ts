/**
 * Creates a union type for a single modifier from the provided string literal arrays.
 * The final type represents one possible value and also includes `undefined` and `null`.
 *
 * @template T - A tuple of readonly string arrays, e.g., `[typeof SEVERITY, typeof DENSITY]`.
 */
export type SemanticModifier<T extends readonly (readonly string[])[]> =
  | T[number][number]
  | undefined
  | null;
