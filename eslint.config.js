// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import storybook from "eslint-plugin-storybook";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import requireTodoJiraUrl from "./eslint-rules/require-todo-jira-url.js";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  importPlugin.flatConfigs.warnings,
  {
    plugins: {
      local: { rules: { "require-todo-jira-url": requireTodoJiraUrl } },
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "local/require-todo-jira-url": "error",
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
      // This rule also flags query-parameter strings from helpers like Superhref, forcing many local rule disables.
      // TODO: Consider re-enabling this rule for string literals (https://warthogs.atlassian.net/browse/LP-5088)
      "svelte/no-navigation-without-resolve": "off",
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
              pattern: "#lib/**",
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
    // Pragma opts-out from vcs integration and requires explicit ignore declarations
    ignores: [
      "pnpm-lock.yaml",
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
      },
    },
  },
  storybook.configs["flat/recommended"],
);
