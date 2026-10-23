import { defineEnvVars } from "@sveltejs/kit/env";

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
  MAIN_LAUNCHPAD_COOKIE_NAME: { schema: (input) => input ?? "" },
  MAIN_LAUNCHPAD_BASE_HOST: { schema: (input) => input ?? "" },
  MAIN_LAUNCHPAD_IP_ADDRESS: { schema: (input) => input ?? "" },
  MAIN_LAUNCHPAD_SKIP_TLS_VERIFY: { schema: (input) => input ?? "" },
  PUBLIC_PACKAGES_API_URL: { public: true, schema: (input) => input ?? "" },
});
