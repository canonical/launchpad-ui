import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sveltekit({
      // Consult https://svelte.dev/docs/kit/integrations
      // for more information about preprocessors
      preprocess: vitePreprocess(),
      compilerOptions: { experimental: { async: true } },
      adapter: adapter(),
      // TODO: https://warthogs.atlassian.net/browse/LP-5107
      paths: { origin: process.env.ORIGIN },
      experimental: { remoteFunctions: true },
    }),
  ],
  build: {
    // As required by Pragma (https://github.com/canonical/pragma-web/blob/69ba3095fea252e827a6e9731bd44e745d5c301c/packages/styles/main/README.md?plain=1#L292)
    cssTarget: ["chrome125", "safari17.5", "firefox120"],
  },
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
              // Parallel Firefox pages can blur inputs in other pages' test iframes.
              // Revisit after https://github.com/microsoft/playwright/issues/42933 is fixed.
              { browser: "firefox", fileParallelism: false },
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
          include: ["src/**/*.test.ts", "test/**/*.test.ts"],
          exclude: ["src/**/*.svelte.test.ts"],
        },
      },
    ],
  },
});
