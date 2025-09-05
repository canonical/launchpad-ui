export type WithoutChildren<T extends { children?: unknown }> = Omit<
  T,
  "children"
>;

export type WithRef<T extends HTMLElement> = {
  /**
   * A reference to the underlying HTML element.
   *
   * **@bindable**
   */
  ref?: T | null;
};
