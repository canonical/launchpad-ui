import type { Handle } from "@sveltejs/kit";
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
