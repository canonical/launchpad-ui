import { sveltekit } from "@sveltejs/kit/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: "node",
    include: ["src/**/*.tests.ts"],
    projects: [
      {
        extends: "./vite.config.ts",
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
          include: ["src/**/*.svelte.test.{js,ts}"],
          exclude: ["src/lib/server/**"],
          setupFiles: ["./test/vitest-setup-client.ts"],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "ssr",
          environment: "node",
          include: ["src/**/*.ssr.test.{js,ts}"],
          setupFiles: ["./test/vitest-setup-msw.ts"],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.test.{js,ts}"],
          exclude: [
            "src/**/*.svelte.test.{js,ts}",
            "src/**/*.ssr.test.{js,ts}",
          ],
          setupFiles: ["./test/vitest-setup-msw.ts"],
        },
      },
    ],
  },
});
