/** Holds the item identity and destination shared by reorder interactions. */
export abstract class Reorder {
  readonly key: string;
  /** Proposed zero-based destination index. */
  to = $state(0);

  constructor(key: string) {
    this.key = key;
  }

  /** Cleans up the reorder interaction. */
  teardown() {}
}
