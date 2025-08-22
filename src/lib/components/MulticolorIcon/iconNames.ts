export const iconNames = new Set([
  "conflict-resolution",
  "conflict",
  "error",
  "power-on",
  "status-failed-small",
  "status-in-progress-small",
  "status-in-progress",
  "status-queued-small",
  "status-queued",
  "status-succeeded-small",
  "status-waiting-small",
  "status-waiting",
  "success",
  "unit-running",
  "warning",
] as const);

export type MulticolorIconName =
  typeof iconNames extends Set<infer T> ? T : never;
