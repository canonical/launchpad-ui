import type { InputType } from "storybook/internal/types";
import type { ModifiersMap } from "./types";

export function modifiersControl<M extends ModifiersMap>(
  componentModifiers: M,
) {
  const argTypes: Record<string, InputType> = {
    modifiers: {
      table: { disable: true },
    },
  };

  for (const key of Object.keys(componentModifiers)) {
    argTypes[key] = {
      control: {
        type: "inline-radio",
      },
      options: ["default", ...componentModifiers[key]],
      table: { category: "modifiers" },
    };
  }

  return argTypes;
}
