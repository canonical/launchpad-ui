import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { jobManager } from "$lib/api/job-manager/client.js";
import { defaultLogObjectName } from "$lib/api/job-manager/constants.js";
import { extractErrorMessage } from "$lib/api/job-manager/utils.js";
import { stripAnsi } from "$lib/utils/index.js";
import { query } from "$app/server";

const JobIdSchema = v.pipe(v.string(), v.toNumber(), v.integer());

export const getJobDetails = query(JobIdSchema, async (jobId) => {
  const {
    error: responseError,
    data,
    response,
  } = await jobManager.GET("/v1/jobs/{job_id}", {
    params: {
      path: {
        job_id: jobId,
      },
    },
  });

  if (responseError) {
    error(response.status, {
      status: response.status,
      message: extractErrorMessage(responseError),
    });
  }

  return data;
});

export const getJobLog = query(JobIdSchema, async (jobId) => {
  const {
    error: responseError,
    data,
    response,
  } = await jobManager.GET("/v1/jobs/{job_id}/object/{object_name}", {
    params: {
      path: {
        job_id: jobId,
        object_name: defaultLogObjectName,
      },
    },
    parseAs: "text",
  });

  if (responseError) {
    if (response.status !== 404) {
      error(response.status, {
        status: response.status,
        message: extractErrorMessage(responseError),
      });
    }

    return []; // No log found, return empty array
  }

  return data.split("\n").map((line) => parseLogLine(line));
});

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
