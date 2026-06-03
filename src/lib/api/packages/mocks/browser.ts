import type { HttpHandler } from "msw";
import { setupWorker } from "msw/browser";
import { createFallbackHandler } from "./handlers/fallback.js";
import { handlers } from "./handlers/index.js";

// Browser-side counterpart to `server.ts`, started from `hooks.client.ts` under
// `--mode mock` so client-side universal `load` runs hit the same handlers as
// SSR. `worker` is referenced inside the fallback's getter — safe because the
// closure captures the binding lazily and MSW invokes it only at request time.
export const worker = setupWorker(
  ...handlers,
  createFallbackHandler(() => worker.listHandlers() as readonly HttpHandler[]),
);
