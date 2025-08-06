type UnionOf<T extends readonly (readonly string[])[]> = T[number][number];

export const modifiers = <T extends readonly (readonly string[])[]>(
  ...modifierCategories: T
): UnionOf<T>[] => {
  return modifierCategories.flat() as UnionOf<T>[];
};
