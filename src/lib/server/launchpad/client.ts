import { createLaunchpadClient } from "@canonical/launchpad-client";
import createDispatcher from "./createDispatcher.js";
import { launchpadApiBaseUrl } from "./launchpadUrl.js";
import {
  MAIN_LAUNCHPAD_IP_ADDRESS,
  MAIN_LAUNCHPAD_SKIP_TLS_VERIFY,
} from "$app/env/private";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare -- Keep the explicit comparison so a truthy string isn't treated as true if the env schema changes.
const skipTlsVerify = MAIN_LAUNCHPAD_SKIP_TLS_VERIFY === true;

const dispatcher =
  MAIN_LAUNCHPAD_IP_ADDRESS || skipTlsVerify
    ? createDispatcher({
        baseUrl: launchpadApiBaseUrl,
        connectTo: MAIN_LAUNCHPAD_IP_ADDRESS,
        rejectUnauthorized: !skipTlsVerify,
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
