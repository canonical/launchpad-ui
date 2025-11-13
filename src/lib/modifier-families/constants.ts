export const MODIFIER_FAMILIES = {
  severity: ["neutral", "positive", "negative", "caution", "information"],
  emphasis: ["neutral", "highlighted", "muted", "accented"],
  // TODO: Figure out where these should be defined (not in modifiers?)
  size: ["x-small", "small", "medium", "large"],
  density: ["dense", "compact", "medium"],
} as const satisfies Record<string, readonly string[]>;
