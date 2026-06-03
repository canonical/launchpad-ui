import type { HttpHandler } from "msw";
import { setupServer } from "msw/node";
import { createFallbackHandler } from "./handlers/fallback.js";
import { handlers } from "./handlers/index.js";

// `server` is referenced inside the fallback's getter — safe because the
// closure captures the binding lazily and MSW invokes it only at request
// time, after this `const` has initialised.
export const server = setupServer(
  ...handlers,
  createFallbackHandler(() => server.listHandlers() as readonly HttpHandler[]),
);
