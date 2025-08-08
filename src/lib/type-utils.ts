export type WithoutChildren<T extends { children?: unknown }> = Omit<
  T,
  "children"
>;

export type ModifiedBy<T extends Array<unknown>> = {
  modifiers?: T;
};
