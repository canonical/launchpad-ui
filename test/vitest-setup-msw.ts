import { afterAll, afterEach, vi } from "vitest";
import { server } from "../src/lib/api/packages/mocks/server.js";

// SvelteKit's `$env/dynamic/public` is populated by the server runtime, which
// doesn't run under vitest. Stub it so `client.ts` gets a baseUrl.
vi.mock("$env/dynamic/public", () => ({
  env: { PUBLIC_PACKAGES_API_URL: "http://msw.local/api/packages" },
}));

// listen() at module load (not in beforeAll): openapi-fetch captures
// `globalThis.fetch` when createClient runs, so MSW must already be patched
// when client.ts evaluates.
server.listen({ onUnhandledRequest: "error" });

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
