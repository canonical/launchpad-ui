import type { Decorator } from "@storybook/sveltekit";
import type { ArgTypes, ArgTypesEnhancer } from "storybook/internal/types";
import { createRawSnippet } from "svelte";

function isSnippetType(prop: ArgTypes) {
  return prop.type?.name?.includes("Snippet<[");
}

export const changeSnippetControl: ArgTypesEnhancer = ({ argTypes }) => {
  for (const key in argTypes) {
    const prop = argTypes[key];
    if (isSnippetType(prop)) {
      prop.control = { type: "text" };
    }
  }
  return argTypes;
};

export const transformSnippetArgs: Decorator = (storyFn, context) => {
  const { args, argTypes } = context;
  const transformedArgs = { ...args };

  for (const key in argTypes) {
    const prop = argTypes[key];

    if (isSnippetType(prop) && typeof args[key] === "string" && args[key]) {
      transformedArgs[key] = createRawSnippet(() => ({
        render: () => args[key] as string,
      }));
    }
  }

  return storyFn({ ...context, args: transformedArgs });
};
