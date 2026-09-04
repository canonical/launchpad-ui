import { uniqBy } from "es-toolkit";

export function deduplicate<T, Key extends keyof T>(
  array: readonly T[],
  by: Key,
): T[] {
  return uniqBy(array, (item) => item[by]);
}
