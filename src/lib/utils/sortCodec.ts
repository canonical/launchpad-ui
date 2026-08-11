import type { Codec } from "@canonical/superhref";

export type SortDirection = "asc" | "desc";

/** A column a collection is sorted by, and which way. */
export type Sort<Column extends string> = {
  readonly key: Column;
  readonly direction: SortDirection;
};

/** A sort codec: the URL encoding plus the transition a header click applies. */
export type SortCodec<Column extends string> = Codec<Sort<Column> | null> & {
  /**
   * Advances `column` one step through ascending -> descending -> unsorted.
   * Any other column restarts at ascending.
   */
  cycle: (current: Sort<Column> | null, column: Column) => Sort<Column> | null;
};

/**
 * A codec for a sort search parameter, expressed as a column name prefixed
 * with `-` when descending — `"name"`, `"-uploaded-at"`.
 *
 * `parse` accepts only members of `columns`; an absent key, an unknown column
 * and a bare prefix alike resolve to `null`, meaning unsorted. The parsed key
 * keeps the literal union type of `columns`, so
 * `sortCodec(["name", "size"])` produces `SortCodec<"name" | "size">`.
 *
 * @param columns The sortable column names.
 * @returns A codec whose parsed value is a column of `columns` paired with a
 * direction, or `null`, plus the `cycle` transition over that value.
 */
export function sortCodec<const T extends readonly string[]>(
  columns: T,
): SortCodec<T[number]> {
  return {
    parse: (raw) => {
      if (raw === null) return null;
      const direction = raw.startsWith("-") ? "desc" : "asc";
      const key = direction === "desc" ? raw.slice(1) : raw;
      return columns.includes(key)
        ? { key: key as T[number], direction }
        : null;
    },
    serialize: (value) => {
      if (value === null) return null;
      return value.direction === "desc" ? `-${value.key}` : value.key;
    },
    cycle: (current, column) => {
      if (current?.key !== column) return { key: column, direction: "asc" };
      return current.direction === "asc"
        ? { key: column, direction: "desc" }
        : null;
    },
  };
}
