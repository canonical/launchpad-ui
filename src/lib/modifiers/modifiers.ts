export function modifiers<T extends ReadonlyArray<ReadonlyArray<string>>>(
  ...modifiers: T
): Array<T[number][number] | undefined | null> {
  return modifiers.flat();
}
