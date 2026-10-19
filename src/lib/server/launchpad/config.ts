import { createLaunchpadClient } from "@canonical/launchpad-client";
import createDispatcher from "./createDispatcher.js";
import { env } from "$env/dynamic/private";

export const launchpadApiBaseUrl = env.MAIN_LAUNCHPAD_BASE_HOST
  ? new URL("/api/devel/", env.MAIN_LAUNCHPAD_BASE_HOST).href
  : "https://api.launchpad.net/devel/";

const dispatcher =
  env.MAIN_LAUNCHPAD_IP_ADDRESS || env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY === "true"
    ? createDispatcher({
        baseUrl: launchpadApiBaseUrl,
        connectTo: env.MAIN_LAUNCHPAD_IP_ADDRESS,
        rejectUnauthorized: env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY !== "true",
      })
    : undefined;
const fetcher = globalThis.fetch;

// Shared transport only: user cookies belong in per-request headers.
export const launchpadClient = createLaunchpadClient({
  baseUrl: launchpadApiBaseUrl,
  fetch: dispatcher
    ? (input, init) => {
        const connectionOptions = { ...init, dispatcher };
        return fetcher(input, connectionOptions);
      }
    : undefined,
});
