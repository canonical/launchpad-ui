export type ModifiersMap = Record<string, readonly string[]>;

export type MergeModifiers<M1 extends ModifiersMap, M2 extends ModifiersMap> = {
  [K in keyof (M1 & M2) | keyof M1 | keyof M2]: K extends keyof M1
    ? K extends keyof M2
      ? Array<M1[K][number] | M2[K][number]>
      : M1[K]
    : K extends keyof M2
      ? M2[K]
      : never;
};

export type ModifiersInput<T extends ModifiersMap> = {
  readonly [K in keyof T]?: T[K][number] | undefined | null;
};

export type ModifiedBy<T extends ModifiersMap> = {
  modifiers?: ModifiersInput<T>;
};

export type ModifiersValues<I extends ModifiersInput<ModifiersMap>> = Array<
  NonNullable<I[keyof I]>
>;
