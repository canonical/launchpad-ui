export function modifiers<T extends readonly (readonly string[])[]>(
  ...modifiers: T
): (T[number][number] | undefined | null)[] {
  return modifiers.flat();
}
