import { defineEnvVars } from "@sveltejs/kit/env";
import * as v from "valibot";

export const variables = defineEnvVars({
  MAIN_LAUNCHPAD_BASE_HOST: {
    schema: v.optional(v.pipe(v.string(), v.url()), "https://launchpad.net"),
    description: "Base host used to reach the main Launchpad service",
  },
  MAIN_LAUNCHPAD_COOKIE_NAME: {
    schema: v.optional(v.pipe(v.string(), v.nonEmpty()), "lp"),
    description: "Session cookie name used with the main Launchpad service",
  },
  MAIN_LAUNCHPAD_IP_ADDRESS: {
    schema: v.optional(v.pipe(v.string(), v.url())),
    description: "Optional IP address override for the main Launchpad service",
  },
  MAIN_LAUNCHPAD_SKIP_TLS_VERIFY: {
    schema: v.pipe(
      v.optional(v.picklist(["true", "false"]), "false"),
      v.transform((value) => value === "true"),
    ),
    description:
      "Skip TLS certificate verification when contacting the main Launchpad service",
  },
  TEST_OBSERVER_IMAGE_ARTIFACTS_URL: {
    schema: v.pipe(v.string(), v.url()),
    description: "URL used to fetch Test Observer image artifacts",
  },
});
