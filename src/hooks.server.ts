import { server } from "$lib/api/packages/mocks/server.js";

// MSW only intercepts under `pnpm dev:mock` (mode=mock). Regular `pnpm dev`
// leaves it off. The browser-side counterpart starts in `hooks.client.ts`.
// `bypass` lets non-packages requests (Vite assets, etc.) through.
if (import.meta.env.MODE === "mock") {
  server.listen({ onUnhandledRequest: "bypass" });
}
