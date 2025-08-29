import type {
  MergeModifiers,
  ModifiersInput,
  ModifiersMap,
  ModifiersValues,
} from "./types";

export function modifiers<M extends ModifiersMap, C extends keyof M>(
  mods: M,
  ...categories: C[]
): Pick<M, C> {
  const out = {} as Pick<M, C>;
  for (const c of categories) out[c] = mods[c];
  return out;
}

/**
 * Merges two ModifiersMap objects.
 * - Keys are unioned.
 * - For overlapping keys, values are deduped and concatenated (preserving `mods1` order).
 */
export function combineModifiers<
  M1 extends ModifiersMap,
  M2 extends ModifiersMap,
>(mods1: M1, mods2: M2): MergeModifiers<M1, M2> {
  const result = {} as MergeModifiers<M1, M2>;

  const keys = new Set([
    ...Object.keys(mods1),
    ...Object.keys(mods2),
  ] as (keyof M1 & keyof M2)[]);

  for (const key of keys) {
    const v1 = mods1[key];
    const v2 = mods2[key];

    if (v1 && v2) {
      const merged = new Set([...v1, ...v2]);
      result[key] = Array.from(merged) as MergeModifiers<M1, M2>[typeof key];
    } else {
      result[key] = (v1 ?? v2) as MergeModifiers<M1, M2>[typeof key];
    }
  }

  return result;
}

export function modifiersValues<I extends ModifiersInput<ModifiersMap>>(
  input?: I,
): ModifiersValues<I> {
  if (!input) return [];

  const out = [] as ModifiersValues<I>;

  for (const value of Object.values(input) as I[keyof I][]) {
    if (value) {
      out.push(value);
    }
  }

  return out;
}
