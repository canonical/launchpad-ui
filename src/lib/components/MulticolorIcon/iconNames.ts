export const iconNames = new Set([
  "conflict",
  "conflict-resolution",
  "error",
  "power-on",
  "status-in-progress",
  "status-queued",
  "status-waiting",
  "success",
  "unit-running",
  "warning",
] as const);

export type MulticolorIconName =
  typeof iconNames extends Set<infer T> ? T : never;
