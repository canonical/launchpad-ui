import createClient from "openapi-fetch";
import type { paths } from "./types.js";
import { env } from "$env/dynamic/private";
// TODO: Should ^ be imported from static instead? AKA inlined build-time?

// An alternative could be to use something like: https://openapi-generator.tech/docs/installation/, which does not require packages that are runtime dependencies, but rather generates the whole client in place.
// TODO: Discuss pros/cons of both approaches.
export const jobManager = createClient<paths>({
  baseUrl: env.JOB_MANAGER_API_URL,
  headers: {
    Authorization: `Bearer ${env.JOB_MANAGER_API_KEY}`,
  },
});
