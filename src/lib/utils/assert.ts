// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(condition: any, message: string): asserts condition {
  if (condition === false) {
    throw new Error(message);
  }
}
