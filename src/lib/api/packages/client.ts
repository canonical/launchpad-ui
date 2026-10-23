import createClient from "openapi-fetch";
import type { paths } from "./types.js";
import { PUBLIC_PACKAGES_API_URL } from "$app/env/public";

if (!PUBLIC_PACKAGES_API_URL) {
  console.error(
    "PUBLIC_PACKAGES_API_URL is not set; packages API requests will fail",
  );
}

export const packagesApi = createClient<paths>({
  baseUrl: PUBLIC_PACKAGES_API_URL,
});
