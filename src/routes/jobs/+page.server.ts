import { jobManager } from "$lib/api/job-manager/client.js";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
  const jobsPromise = jobManager
    .GET("/v1/jobs", {
      fetch,
    })
    .then((response) => response.data);

  return { jobsPromise };
}) satisfies PageServerLoad;
