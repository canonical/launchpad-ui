export type WithoutChildren<T extends { children?: unknown }> = Omit<
  T,
  "children"
>;

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
