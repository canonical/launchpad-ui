export function filtersDiffer<
  T extends { [Key in keyof T]: string | boolean | null },
>(a: T, b: T): boolean {
  return (Object.keys(a) as (keyof T)[]).some((key) => {
    for (const value of [a[key], b[key]]) {
      if (value !== null && typeof value === "object") {
        // Add handling for non-primitive filter values here if needed
        throw new Error(
          `Cannot compare non-primitive filter value for "${String(key)}"`,
        );
      }
    }
    return a[key] !== b[key];
  });
}
