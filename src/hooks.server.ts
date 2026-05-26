import { server } from "$lib/api/packages/mocks/server.js";

// MSW only intercepts under `bun run dev:mock` (mode=mock). Regular `bun run
// dev` leaves it off.
// `bypass` lets non-packages requests (job-manager, Vite assets, etc.) through.
if (import.meta.env.MODE === "mock") {
  server.listen({ onUnhandledRequest: "bypass" });
}
