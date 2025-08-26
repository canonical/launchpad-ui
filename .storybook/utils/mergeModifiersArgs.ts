import type { Decorator } from "@storybook/sveltekit";
import { InputType } from "storybook/internal/types";

export const mergeModifiersArgs: Decorator = (storyFn, context) => {
  const { args, argTypes } = context;

  const merged: Record<string, unknown> = {
    ...(args.modifiers as object | undefined),
  };

  const modifiersKeys = modifiersArgs(argTypes);

  for (const key of modifiersKeys) {
    const value = (args as Record<string, unknown>)[key];
    const normalizedKey = key.startsWith("modifiers.")
      ? key.slice("modifiers.".length)
      : key;
    if (value !== undefined && value !== null && value !== "") {
      merged[normalizedKey] = value;
    }
  }

  const transformedArgs = { ...args } as Record<string, unknown>;
  transformedArgs.modifiers = merged;

  for (const key of modifiersKeys) {
    delete transformedArgs[key];
  }

  return storyFn({ ...context, args: transformedArgs });
};

const modifiersArgs = (argTypes: Record<string, InputType>) => {
  return Object.keys(argTypes).filter((key) =>
    isModifierCategory(argTypes[key]?.table?.category),
  );
};

const isModifierCategory = (category?: string) =>
  category?.toLowerCase() === "modifiers";
