import { createHrefClient } from "../openapi-href.js";
import type { paths } from "./types.js";
import { env } from "$env/dynamic/public";

export const jobManagerHref = createHrefClient<paths>({
  baseUrl: env.PUBLIC_JOB_MANAGER_API_URL,
});
