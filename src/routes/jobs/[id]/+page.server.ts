import { error } from "@sveltejs/kit";
import { jobManager } from "$lib/api/job-manager/client.js";
import { defaultLogObjectName } from "$lib/api/job-manager/constants.js";
import { extractErrorMessage } from "$lib/api/job-manager/utils.js";
import { stripAnsi } from "$lib/utils/index.js";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    error(400, "Invalid job ID");
  }

  const [jobResponse, logResponse] = await Promise.all([
    jobManager.GET("/v1/jobs/{job_id}", {
      params: {
        path: {
          job_id: id,
        },
      },
      fetch,
    }),
    jobManager.GET("/v1/jobs/{job_id}/object/{object_name}", {
      params: {
        path: {
          job_id: id,
          object_name: defaultLogObjectName,
        },
      },
      parseAs: "text",
      fetch,
    }),
  ]);

  if (jobResponse.error) {
    error(
      jobResponse.response.status,
      `Failed to fetch job: ${extractErrorMessage(jobResponse.error)}`,
    );
  }

  if (logResponse.error) {
    if (logResponse.response.status !== 404) {
      error(
        logResponse.response.status,
        `Failed to fetch default log: ${extractErrorMessage(logResponse.error)}`,
      );
    }

    return {
      job: jobResponse.data,
      log: [],
    };
  }

  const log = logResponse.data.split("\n").map((line) => parseLogLine(line));

  return { job: jobResponse.data, log };
}) satisfies PageServerLoad;

function parseLogLine(rawLine: string) {
  const line = stripAnsi(rawLine);

  // 2025-12-05 21:34:29.446 [admin] mkdir -p /home/ubuntu/.ssh
  // 2025-12-05 21:34:29.454 Starting proxy setup...
  const match = line.match(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}\.\d{3}) (.*)$/,
  );

  if (match) {
    const [, date, time, message] = match;
    return {
      timestamp: `${date}T${time}Z`,
      message,
    };
  }

  return {
    timestamp: new Date(0).toISOString(),
    message: line,
  };
}
