import * as v from "valibot";

export const jobsTableLimitOptions = [25, 50, 100] as const;
export const jobsTableLimitDefault =
  50 as const satisfies (typeof jobsTableLimitOptions)[number];

export const jobsTableLimitSchema = v.nullable(
  v.fallback(
    v.pipe(
      v.union([v.number(), v.string()]),
      v.toNumber(),
      v.picklist(jobsTableLimitOptions),
    ),
    jobsTableLimitDefault,
  ),
  jobsTableLimitDefault,
);

export const jobsTablePageSchema = v.nullable(
  v.fallback(
    v.pipe(
      v.union([v.number(), v.string()]),
      v.toNumber(),
      v.integer(),
      v.minValue(1),
    ),
    1,
  ),
  1,
);

export function toPageNumber(offset: number, limit: number) {
  return Math.floor(offset / limit) + 1;
}

export function toOffset(page: number, limit: number) {
  return (page - 1) * limit;
}
