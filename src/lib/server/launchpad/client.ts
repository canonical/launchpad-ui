import { createLaunchpadClient } from "@canonical/launchpad-client";
import createDispatcher from "./createDispatcher.js";
import { launchpadApiBaseUrl } from "./launchpadUrl.js";
import {
  MAIN_LAUNCHPAD_IP_ADDRESS,
  MAIN_LAUNCHPAD_SKIP_TLS_VERIFY,
} from "$app/env/private";

const dispatcher =
  MAIN_LAUNCHPAD_IP_ADDRESS || MAIN_LAUNCHPAD_SKIP_TLS_VERIFY === true
    ? createDispatcher({
        baseUrl: launchpadApiBaseUrl,
        connectTo: MAIN_LAUNCHPAD_IP_ADDRESS,
        rejectUnauthorized: MAIN_LAUNCHPAD_SKIP_TLS_VERIFY !== true,
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
