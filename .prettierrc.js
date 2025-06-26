/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  // Normalize with Biome's defaults
  printWidth: 80,
  endOfLine: "lf",
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  semi: true,
  trailingComma: "all",
  // Adhere to Pragma's formatting style
  useTabs: false,
  tabWidth: 2,
  singleQuote: false,
  // Overrides
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
        svelteAllowShorthand: true,
        svelteIndentScriptAndStyle: true,
        svelteSortOrder: "options-scripts-markup-styles",
        svelteStrictMode: true,
      },
    },
  ],
  plugins: ["prettier-plugin-svelte"],
};

export default config;
