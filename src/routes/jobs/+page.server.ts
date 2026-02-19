import { error } from "@sveltejs/kit";
import { jobManager } from "$lib/api/job-manager/client.js";
import { extractErrorMessage } from "$lib/api/job-manager/utils.js";
import type { PageServerLoad } from "./$types";

// FIXME(async-boundaries): At this moment (kit 2.49.2, svelte 5.45.8), errors thrown in remote functions are not properly captured by <svelte:boundary> (https://github.com/sveltejs/kit/issues/14808), nor trigger the +error pages (https://github.com/sveltejs/kit/issues/14398). This means that if something goes wrong during the fetch of jobs, the error blows up the whole page.
// A workaround would be to catch the errors in the remote function and return a result object with either data or error, but this doesn't play nicely with the intended way of using remote functions (i.e. call where needed) requiring either an error check everywhere where used (terrible DX) or a centralized call (= a load function once again).
// Until that's fixed, it seems to make more sense to stick with the load function instead.
export const load = (async ({ fetch, url }) => {
  const jobsPromise = jobManager
    .GET("/v1/jobs", {
      params: {
        query: {
          sort: url.searchParams.get("sort"),
        },
      },
      fetch,
    })
    .then((response) => {
      if (response.error) {
        error(response.response.status, extractErrorMessage(response.error));
      }
      return response.data;
    });

  return { jobsPromise };
}) satisfies PageServerLoad;
