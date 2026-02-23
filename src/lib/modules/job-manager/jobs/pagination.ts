import * as v from "valibot";

export const jobsTableLimitOptions = [25, 50, 100] as const;
export const jobsTableLimitDefault =
  50 as const satisfies (typeof jobsTableLimitOptions)[number];

export const jobsTableLimitSchema = v.fallback(
  v.pipe(
    v.union([v.string(), v.number()]),
    v.toNumber(),
    v.finite(),
    v.transform((num) =>
      // Find the closest option to the provided number
      jobsTableLimitOptions.reduce((prev, curr) =>
        Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev,
      ),
    ),
  ),
  jobsTableLimitDefault,
);

export const jobsTablePageSchema = v.fallback(
  v.pipe(
    v.union([v.string(), v.number()]),
    v.toNumber(),
    v.integer(),
    v.minValue(1),
  ),
  1,
);

export function toPageNumber(offset: number, limit: number) {
  return Math.floor(offset / limit) + 1;
}

export function toOffset(page: number, limit: number) {
  return (page - 1) * limit;
}
