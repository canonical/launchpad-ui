import type { PackagesFilters } from "./schema.js";

export function packagesFiltersDiffer(
  a: PackagesFilters,
  b: PackagesFilters,
): boolean {
  return (Object.keys(a) as (keyof PackagesFilters)[]).some((key) => {
    for (const value of [a[key], b[key]]) {
      if (value !== null && typeof value === "object") {
        // Add handling for non-primitive filter values here if needed
        throw new Error(
          `Cannot compare non-primitive filter value for "${key}"`,
        );
      }
    }
    return a[key] !== b[key];
  });
}
