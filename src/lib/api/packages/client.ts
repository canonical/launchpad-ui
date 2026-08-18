import createClient from "openapi-fetch";
import type { paths } from "./types.js";
import { env as publicEnv } from "$env/dynamic/public";

if (!publicEnv.PUBLIC_PACKAGES_API_URL) {
  console.error(
    "PUBLIC_PACKAGES_API_URL is not set; packages API requests will fail",
  );
}

export const packagesApi = createClient<paths>({
  baseUrl: publicEnv.PUBLIC_PACKAGES_API_URL,
});
