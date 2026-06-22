import type { Handle } from "@sveltejs/kit";
import { server } from "$lib/api/packages/mocks/server.js";

// MSW only intercepts under `pnpm dev:mock` (mode=mock). Regular `pnpm dev`
// leaves it off. The browser-side counterpart starts in `hooks.client.ts`.
// `bypass` lets non-packages requests (Vite assets, etc.) through.
if (import.meta.env.MODE === "mock") {
  server.listen({ onUnhandledRequest: "bypass" });
}

// When a universal `load` fetches during SSR, SvelteKit serializes the response
// to replay it on the client and blocks reading any header not allowlisted here.
const SERIALIZABLE_RESPONSE_HEADERS = new Set([
  "content-type",
  "content-length",
]);

export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    filterSerializedResponseHeaders: (name) =>
      SERIALIZABLE_RESPONSE_HEADERS.has(name.toLowerCase()),
  });
