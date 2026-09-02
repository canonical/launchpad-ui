import type { Codec } from "@canonical/superhref";

export const SORT_DIRECTIONS = ["ascending", "descending", "none"] as const;

/**
 * Which way a collection is sorted, as an `aria-sort` value so a table header
 * hands a direction straight to the attribute.
 */
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

/**
 * Advances `column` one step: unsorted -> ascending -> descending -> unsorted.
 * Any other column restarts at ascending.
 */
export type Cycle<Column extends string> = (column: Column) => Sort<Column>;

/**
 * The sort in effect: the column, which way it runs, and the transition a
 * header click applies. `parse` builds it, so every reader of the parameter
 * gets `cycle` without reaching for the codec.
 *
 * The two shapes are exclusive — a column always runs a real direction, and
 * `"none"` always comes without a column — so narrowing on `key` or on
 * `direction` settles the other.
 */
export type Sort<Column extends string> =
  | {
      readonly key: Column;
      readonly direction: "ascending" | "descending";
      readonly cycle: Cycle<Column>;
    }
  | {
      readonly key: null;
      readonly direction: "none";
      readonly cycle: Cycle<Column>;
    };

/** The value `parse` returns, before `cycle` is attached to it. */
type SortValue<Column extends string> =
  | { key: Column; direction: "ascending" | "descending" }
  | { key: null; direction: "none" };

/**
 * A codec for a sort search parameter, expressed as a column name prefixed
 * with `-` when descending — `"name"`, `"-uploaded-at"`.
 *
 * `parse` accepts only members of `columns`; an absent key, an unknown column
 * and a bare prefix alike resolve to the unsorted state. The parsed key keeps
 * the literal union type of `columns`, so `sortCodec(["name", "size"])`
 * produces `Codec<Sort<"name" | "size">>`.
 *
 * @param columns The sortable column names.
 * @returns The codec for the parameter.
 */
export function sortCodec<const T extends readonly string[]>(
  columns: T,
): Codec<Sort<T[number]>> {
  const unsorted = sortState<T[number]>({ key: null, direction: "none" });
  return {
    parse: (raw) => {
      if (raw === null) return unsorted;
      const descending = raw.startsWith("-");
      const key = descending ? raw.slice(1) : raw;
      return columns.includes(key)
        ? sortState<T[number]>({
            key: key as T[number],
            direction: descending ? "descending" : "ascending",
          })
        : unsorted;
    },
    serialize: (value) => {
      if (value === null || value.key === null) return null;
      return value.direction === "descending" ? `-${value.key}` : value.key;
    },
  };
}

/**
 * Closes `value` over the transition to its neighbouring states.
 *
 * @param value The column and direction in effect.
 * @returns The sort, carrying its own `cycle`.
 */
function sortState<Column extends string>(
  value: SortValue<Column>,
): Sort<Column> {
  const cycle = (column: Column): Sort<Column> =>
    sortState<Column>(
      value.key !== column
        ? { key: column, direction: "ascending" }
        : value.direction === "ascending"
          ? { key: column, direction: "descending" }
          : { key: null, direction: "none" },
    );
  return { ...value, cycle };
}
