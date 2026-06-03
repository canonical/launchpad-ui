import createClient from "openapi-fetch";
import type { paths } from "./types.js";
import { env as publicEnv } from "$env/dynamic/public";

export const packagesApi = createClient<paths>({
  baseUrl: publicEnv.PUBLIC_PACKAGES_API_URL,
});
