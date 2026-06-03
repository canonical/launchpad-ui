import { DEFAULT_PAGE_SIZE } from "../../../constants.js";

export const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * `sort` accepts a `±field` shorthand (`-uploadDateTime`) or pairs with
 * `order`. `size: "all"` returns every filtered item on a single page.
 */
export const paginate = <T>(
  items: T[],
  query:
    | {
        page?: number;
        size?: number | "all";
        sort?: string;
        order?: "asc" | "desc";
      }
    | undefined,
  sortKey?: (item: T, field: string) => string | number | undefined,
): {
  items: T[];
  total: number;
  page: number;
  size: number;
} => {
  const sort = query?.sort;
  const result = items.slice();
  if (sort && sortKey) {
    const hasPrefix = sort.startsWith("-") || sort.startsWith("+");
    const desc = hasPrefix ? sort.startsWith("-") : query?.order === "desc";
    const field = hasPrefix ? sort.slice(1) : sort;
    result.sort((a, b) => {
      const va = sortKey(a, field);
      const vb = sortKey(b, field);
      if (va === vb) return 0;
      if (va === undefined) return 1;
      if (vb === undefined) return -1;
      return va < vb ? (desc ? 1 : -1) : desc ? -1 : 1;
    });
  }
  const total = items.length;
  if (query?.size === "all") {
    return { items: result, total, page: 1, size: total };
  }
  const page = Math.max(1, Math.floor(query?.page ?? 1));
  const size = Math.max(1, Math.floor(query?.size ?? DEFAULT_PAGE_SIZE));
  const start = (page - 1) * size;
  return {
    items: result.slice(start, start + size),
    total,
    page,
    size,
  };
};

export const matchesSearch = (
  needle: string | undefined,
  haystacks: Array<string | undefined>,
): boolean => {
  if (!needle) return true;
  const q = needle.toLowerCase();
  return haystacks.some(
    (h) => typeof h === "string" && h.toLowerCase().includes(q),
  );
};

export const matchesFilter = <T>(
  value: T,
  filter: T | T[] | undefined,
): boolean => {
  if (filter === undefined) return true;
  const allowed = asArray(filter);
  if (allowed.length === 0) return true;
  return allowed.includes(value);
};
