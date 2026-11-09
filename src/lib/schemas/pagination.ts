import * as v from "valibot";

export const MAX_PAGE_SIZE = 100;

export const paginationSchema = v.object({
  page: v.pipe(v.number(), v.integer(), v.minValue(1)),
  size: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1),
    v.maxValue(MAX_PAGE_SIZE),
  ),
});
