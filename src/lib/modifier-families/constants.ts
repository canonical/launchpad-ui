export const MODIFIER_FAMILIES = {
  severity: ["positive", "negative", "caution", "information"],
  // TODO: Figure out where these should be defined (not in modifiers?)
  size: ["x-small", "small", "medium", "large"],
  density: ["dense", "compact", "medium"],
} as const satisfies Record<string, readonly string[]>;
