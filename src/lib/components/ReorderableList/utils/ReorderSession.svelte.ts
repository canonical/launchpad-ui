export abstract class ReorderSession {
  readonly key: string;
  to = $state(0);

  constructor(key: string) {
    this.key = key;
  }

  teardown() {}
}
