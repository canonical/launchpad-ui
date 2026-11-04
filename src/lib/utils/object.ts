/**
 * Note: These implementations were not copied from lodash due to its
 * complex dependency chains on internal helper functions.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function setNestedValue(obj: any, path: string, value: any): any {
  const parts = path.split(".");
  const lastPart = parts.pop()!;

  const result = { ...obj };
  let current = result;

  for (const prop of parts) {
    current[prop] = { ...current[prop] };
    current = current[prop];
  }

  current[lastPart] = value;
  return result;
}

export function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}
