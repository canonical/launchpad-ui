/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-html/svelte"],
  rules: {
    "color-no-hex": [
      true,
      { message: "Use a CSS color variable instead of a hex color." },
    ],
    "color-named": [
      "never",
      { message: "Use a CSS color variable instead of a named color." },
    ],
    "function-disallowed-list": [
      [/^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|device-cmyk|gray)$/i],
      {
        message:
          "Use a CSS color variable instead of constructing a color with a function.",
      },
    ],
  },
};
