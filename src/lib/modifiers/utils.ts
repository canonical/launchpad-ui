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
  const result: Record<string, readonly string[]> = {};

  const keys = new Set<string>([
    ...Object.keys(mods1 as Record<string, readonly string[]>),
    ...Object.keys(mods2 as Record<string, readonly string[]>),
  ]);

  for (const key of keys) {
    const v1 = (mods1 as Record<string, readonly string[] | undefined>)[key];
    const v2 = (mods2 as Record<string, readonly string[] | undefined>)[key];

    if (v1 && v2) {
      const merged = [...v1, ...v2.filter((x) => !v1.includes(x))];
      result[key] = Object.freeze(merged);
    } else {
      result[key] = (v1 ?? v2)!;
    }
  }

  return result as MergeModifiers<M1, M2>;
}

export function modifiersValues<I extends ModifiersInput<ModifiersMap>>(
  input?: I,
): ModifiersValues<I> {
  if (!input) return [] as ModifiersValues<I>;

  const out: Array<string> = [];

  for (const value of Object.values(input) as I[keyof I][]) {
    if (value) {
      out.push(value);
    }
  }

  return out as ModifiersValues<I>;
}
