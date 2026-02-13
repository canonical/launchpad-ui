import createClient from "openapi-fetch";
import type { paths } from "./types.js";
import { env as privateEnv } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
// TODO: Should ^ be imported from static instead? AKA inlined build-time?

// An alternative could be to use something like: https://openapi-generator.tech/docs/installation/, which does not require packages that are runtime dependencies, but rather generates the whole client in place.
// TODO: Discuss pros/cons of both approaches.
export const jobManager = createClient<paths>({
  baseUrl: publicEnv.PUBLIC_JOB_MANAGER_API_URL,
  headers: {
    Authorization: `Bearer ${privateEnv.JOB_MANAGER_API_KEY}`,
  },
});
