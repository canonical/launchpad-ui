// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import storybook from "eslint-plugin-storybook";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  importPlugin.flatConfigs.warnings,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
      "svelte/no-target-blank": "warn",
      "svelte/prefer-const": "warn",
      "import/no-empty-named-blocks": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          pathGroups: [
            {
              pattern: "https://**",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "http://**",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@**",
              group: "external",
              position: "before",
            },
            {
              pattern: "$lib/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "object"],
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
          },
          named: {
            enabled: true,
            types: "mixed",
          },
          "newlines-between": "never",
        },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-duplicates": ["error", { "prefer-inline": false }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/lib/components/**"],
    rules: {
      "svelte/no-navigation-without-resolve": [
        "error",
        {
          // We have to ignore links, because our meant-to-be-upstreamed components can't depend on kit and its `resolve` (see: https://sveltejs.github.io/eslint-plugin-svelte/rules/no-navigation-without-resolve/).
          // On our side, we should still enforce the rule
          ignoreLinks: true,
        },
      ],
    },
  },
  {
    // Pragma opts-out from vcs integration and requires explicit ignore declarations
    ignores: [
      "bun.lock",
      "bun.lockb",
      "node_modules/**",
      "build/**",
      ".svelte-kit/**",
      "*storybook.log",
      "storybook-static/**",
      ".storybook/**/*.svelte",
    ],
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
  storybook.configs["flat/recommended"],
);
