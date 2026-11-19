import type { Handle, HandleServerError } from "@sveltejs/kit/hooks";
import { resolveUser } from "#lib/server/user.js";

// When a universal `load` fetches during SSR, SvelteKit serializes the response
// to replay it on the client and blocks reading any header not allowlisted here.
const SERIALIZABLE_RESPONSE_HEADERS = new Set([
  "content-type",
  "content-length",
]);

export const handle: Handle = ({ event, resolve }) => {
  event.locals.user = resolveUser(event);

  return resolve(event, {
    filterSerializedResponseHeaders: (name) =>
      SERIALIZABLE_RESPONSE_HEADERS.has(name.toLowerCase()),
  });
};

/**
 * Keeps a page at status 200 when it fails with a specific error.
 *
 * If a boundary catches an error, the page will still inherit the status of that error.
 * That's why we add a special flag `dontFailThePage` to certain errors to keep the page at status 200.
 * In most cases it should be used if the <svelte:boundary> is expected to catch the error,
 * so the page renders most of the other content, still reports status 200 and only shows an error
 * in the part controlled by the boundary.
 */
export const handleError: HandleServerError = ({ kind, error }) => {
  if (kind === "app" && error.dontFailThePage) return { status: 200 };
};
