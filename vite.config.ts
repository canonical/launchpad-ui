import { sveltekit } from "@sveltejs/kit/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
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
