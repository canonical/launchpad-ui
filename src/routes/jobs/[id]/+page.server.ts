import { error } from "@sveltejs/kit";
import { jobManager } from "$lib/api/job-manager/client.js";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    error(400, "Invalid job ID");
  }

  const response = await jobManager.GET("/v1/jobs/{job_id}", {
    params: {
      path: {
        job_id: id,
      },
    },
  });

  if (response.error) {
    console.error(response.error);
    error(500, "Failed to fetch job details");
  }

  return { job: response.data };
}) satisfies PageServerLoad;
