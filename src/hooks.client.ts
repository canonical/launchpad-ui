import type { ClientInit } from "@sveltejs/kit";

// MSW only intercepts under `pnpm dev:mock` (mode=mock); regular `pnpm dev`
// leaves it off. Mirrors the server-side gate in `hooks.server.ts` so that
// client-side universal `load` runs are mocked too. The dynamic import keeps
// the browser worker out of non-mock bundles. `bypass` lets non-packages
// requests (job-manager, Vite assets, etc.) through.
export const init: ClientInit = async () => {
  if (import.meta.env.MODE === "mock") {
    const { worker } = await import("$lib/api/packages/mocks/browser.js");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
};
