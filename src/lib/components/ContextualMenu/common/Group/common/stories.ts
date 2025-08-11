export const commonArgTypes = {
  icon: {
    control: false,
  },
  disabled: {
    control: "boolean",
    description: "Whether the item is disabled.",
    table: {
      type: {
        summary: "boolean",
      },
    },
  },
} as const;
