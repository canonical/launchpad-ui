import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "node",
      include: ["src/**/*.tests.ts"],
      projects: [
        {
          extends: "./vite.config.ts",
          test: {
            name: "client",
            environment: "browser",
            browser: {
              enabled: true,
              headless: true,
              provider: "playwright",
              instances: [{ browser: "chromium" }],
            },
            include: ["src/**/*.svelte.test.{js,ts}", "src/**/*.test.{js,ts}"],
            exclude: ["src/lib/server/**", "src/**/*.ssr.test.{js,ts}"],
            setupFiles: ["./vitest-setup-client.ts"],
          },
        },
        {
          extends: "./vite.config.ts",
          test: {
            name: "ssr",
            environment: "node",
            include: ["src/**/*.ssr.test.{js,ts}"],
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
          },
        },
      ],
    },
  }),
);
