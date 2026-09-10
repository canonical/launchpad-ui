export type ReorderSessionKind = "drag" | "grab";

/**
 * One in-flight reorder gesture, owned solely by the list. A session never
 * writes to the items array; it only records where the item should appear, so
 * abandoning it is enough to restore the original order.
 */
export abstract class ReorderSession {
  abstract readonly kind: ReorderSessionKind;

  readonly key: string;
  to = $state(0);

  constructor(key: string) {
    this.key = key;
  }

  teardown() {}
}
