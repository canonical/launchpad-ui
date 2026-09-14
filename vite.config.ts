import { sveltekit } from "@sveltejs/kit/vite";
import { playwright } from "@vitest/browser-playwright";
import { Features } from "lightningcss";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  test: {
    expect: {
      requireAssertions: true,
    },
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
