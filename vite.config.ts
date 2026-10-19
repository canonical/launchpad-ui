import { sveltekit } from "@sveltejs/kit/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    expect: {
      requireAssertions: true,
    },
    execArgv: ["--no-webstorage"],
    projects: [
      {
        extends: true,
        test: {
          name: "client",
          // SvelteKit evaluates remote modules in Vite's SSR runner, outside Vitest's CJS loader.
          deps: {
            optimizer: { ssr: { enabled: true, include: ["undici"] } },
          },
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [
              { browser: "chromium" },
              { browser: "firefox" },
              { browser: "webkit" },
            ],
          },
          include: ["src/**/*.svelte.test.ts"],
          exclude: ["src/lib/server/**"],
          setupFiles: ["./test/vitest-setup-client.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.svelte.test.ts"],
          setupFiles: ["./test/vitest-setup-msw.ts"],
        },
      },
    ],
  },
});
