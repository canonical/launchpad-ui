export const SEMANTIC_MODIFIERS = {
  density: ["dense"],
  severity: ["error", "information", "caution", "success"],
} as const;

type SemanticModifierValues<K extends keyof typeof SEMANTIC_MODIFIERS> =
  (typeof SEMANTIC_MODIFIERS)[K][number];

type SemanticModifierKey = keyof typeof SEMANTIC_MODIFIERS;

export type SemanticModifier<K extends SemanticModifierKey> =
  | SemanticModifierValues<K>
  | undefined;

export type SemanticModifiers<K extends readonly SemanticModifierKey[]> = Array<
  K[number] extends SemanticModifierKey
    ? SemanticModifierValues<K[number]>
    : never
>;
