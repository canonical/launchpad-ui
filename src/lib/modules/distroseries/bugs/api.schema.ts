import * as v from "valibot";

// TODO: Remove this fallback once the generated client provides a
// searchTasksCounts response contract.
const countSchema = v.pipe(v.number(), v.safeInteger(), v.minValue(0));

export const bugTaskCountsSchema = v.object({
  total: countSchema,
  by_status: v.object({ INPROGRESS: countSchema }),
  by_importance: v.object({ CRITICAL: countSchema }),
});
