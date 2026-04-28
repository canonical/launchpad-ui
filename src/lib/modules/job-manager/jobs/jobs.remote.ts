import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { jobManager } from "$lib/api/job-manager/client.js";
import { extractErrorMessage } from "$lib/api/job-manager/utils.js";
import { architectureFilterSchema, statusFilterSchema } from "./filtering.js";
import {
  jobsTableLimitSchema,
  jobsTablePageSchema,
  toOffset,
} from "./pagination.js";
import { query } from "$app/server";

export const getCapacity = query(async () => {
  const response = await jobManager.GET("/v1/capacity");

  if (response.error) {
    // FIXME: What to do here?
    // @ts-expect-error - The schema defines this endpoint as errorless, hence TS complains, but a 500 error could still happen, couldn't it?
    const status = response.response?.status ?? 500;
    error(status, {
      status,
    });
  }

  return response.data;
});

export const getJobs = query(
  v.object({
    page: jobsTablePageSchema,
    limit: jobsTableLimitSchema,
    // TODO: Validate sort values at some point?
    sort: v.nullable(v.string()),
    filters: v.object({
      architecture: architectureFilterSchema,
      status: statusFilterSchema,
    }),
  }),
  async (validatedParams) => {
    const {
      page,
      limit,
      sort,
      filters: { architecture, status },
    } = validatedParams;

    const response = await jobManager.GET("/v1/jobs", {
      params: {
        query: {
          sort,
          limit,
          offset: toOffset(page, limit),
          architecture,
          status,
        },
      },
    });

    if (response.error) {
      error(response.response.status, {
        status: response.response.status,
        message: extractErrorMessage(response.error),
      });
    }

    return response.data;
  },
);
