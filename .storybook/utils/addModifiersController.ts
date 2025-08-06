import type { ArgTypesEnhancer } from "storybook/internal/types";

export const addModifiersController: ArgTypesEnhancer = ({ argTypes }) => {
  if ("modifiers" in argTypes) {
    const modifiers = argTypes.modifiers.type?.name || "";
    const options = modifiers
      .replace(/["'\\[\]\\(\\)]/g, "")
      .split("|")
      .map((option) => option.trim())
      .filter(
        (option: string) =>
          option !== "null" && option !== "undefined" && option !== "",
      );

    if (options.length) {
      argTypes = {
        ...argTypes,
        modifiers: {
          ...argTypes.modifiers,
          control: { type: "inline-check", labels: { test: "hello?" } },
          options,
        },
      };
    }
  }
  return argTypes;
};
