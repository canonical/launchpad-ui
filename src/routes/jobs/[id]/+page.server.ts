import { error } from "@sveltejs/kit";
import { jobManager } from "$lib/api/job-manager/client.js";
import { stripAnsi } from "$lib/utils/index.js";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
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
    fetch,
  });

  if (response.error) {
    console.error(response.error);
    error(500, "Failed to fetch job details");
  }

  const job = response.data;

  const defaultLogUrl = job.log_urls?.find((url) =>
    // @ts-expect-error until log_urls is typed properly
    url.endsWith("default.log"),
  );

  if (!defaultLogUrl) {
    return {
      job,
      log: [],
    };
  }

  // @ts-expect-error until log_urls is typed properly
  const logResponse = await fetch(defaultLogUrl);

  if (!logResponse.ok) {
    console.error(
      `Failed to fetch default log: ${logResponse.status} ${logResponse.statusText}`,
    );
    return { job, log: [] };
  }

  const logText = await logResponse.text();
  const log = logText.split("\n").map((line) => parseLogLine(line));

  return { job, log, logUrl: defaultLogUrl as string };
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
