import * as v from "valibot";
import {
  architectureValues,
  jobStatusValues,
} from "$lib/api/job-manager/types.js";

export const architectureFilterSchema = v.fallback(
  v.nullable(v.pipe(v.string(), v.picklist(architectureValues))),
  null,
);

export const statusFilterSchema = v.fallback(
  v.nullable(v.pipe(v.string(), v.picklist(jobStatusValues))),
  null,
);
