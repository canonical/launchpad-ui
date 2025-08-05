import type { GLOBAL_MODIFIERS } from "$lib/modifiers/constants";

export type Modifiers = Record<string, readonly string[]>;

/**
 * Define modifiers that can be applied to component.
 *
 * @template GlobalModifierCategory - The category of global modifiers (e.g., DENSITY, SEVERITY).
 * @template LocalModifiers - Local modifiers specific to the component.
 */
export interface ModifiedBy<
  GlobalModifierCategory extends keyof typeof GLOBAL_MODIFIERS,
  LocalModifiers extends Modifiers = never,
> {
  modifiers?: Array<
    | (typeof GLOBAL_MODIFIERS)[GlobalModifierCategory][number]
    | (LocalModifiers extends Record<string, ReadonlyArray<infer M>>
        ? M
        : never)
    | null
    | undefined
  >;
}
