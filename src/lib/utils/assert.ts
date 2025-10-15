export function assert(condition: boolean, message: string): asserts condition {
  if (condition === false) {
    throw new Error(message);
  }
}

export function assertDefined<T>(
  value: T | undefined | null,
  message: string,
): asserts value is T {
  assert(value !== undefined && value !== null, message);
}
