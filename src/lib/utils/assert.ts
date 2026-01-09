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

/**
 * Asserts that a value is never. Used for exhaustive checks.
 *
 * @param value The value that should never occur.
 * @param message The message to include in the error.
 * @throws Error always throws an error with the provided message.
 */
export function assertNever(value: never, message: string): never {
  throw new Error(message, value);
}

/**
 * A safe version of assertNever that logs the value instead of throwing.
 * Used for exhaustive checks where throwing is not desired.
 *
 * @param value The value that should never occur.
 * @param message The message to log.
 */
export function safeAssertNever(value: never, message: string): void {
  console.error(message, value);
}
