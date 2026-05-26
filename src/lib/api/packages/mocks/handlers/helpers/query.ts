/**
 * openapi-fetch serializes nested query objects with `deepObject` style
 * (`?filter[scope]=my`); this reverses that into `{ filter: { scope: "my" } }`.
 */
export const parseQuery = (url: URL): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  const push = (
    bucket: Record<string, unknown>,
    key: string,
    value: string,
  ) => {
    const existing = bucket[key];
    if (existing === undefined) {
      bucket[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      bucket[key] = [existing, value];
    }
  };
  for (const [rawKey, value] of url.searchParams.entries()) {
    const m = rawKey.match(/^([^[]+)\[([^\]]+)\]$/);
    if (m) {
      const [, top, sub] = m;
      const nested = (result[top] ??= {}) as Record<string, unknown>;
      push(nested, sub, value);
    } else {
      push(result, rawKey, value);
    }
  }
  return result;
};

export const readString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const readNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

export const readFilterField = (
  queryParams: Record<string, unknown>,
  field: string,
): string | string[] | undefined => {
  const filter = queryParams.filter;
  if (typeof filter !== "object" || filter === null) return undefined;
  const value = (filter as Record<string, unknown>)[field];
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return value as string[];
  }
  return undefined;
};

export const readPaginationQuery = (
  queryParams: Record<string, unknown>,
): { page?: number; size?: number; sort?: string } => ({
  page: readNumber(queryParams.page),
  size: readNumber(queryParams.size),
  sort: readString(queryParams.sort),
});

export const readListingSize = (
  value: unknown,
): number | "all" | undefined => {
  if (value === "all") return "all";
  return readNumber(value);
};
