export class ChainingManager {
  private _chaining: boolean = false;
  private chainingTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    /**
     * The duration (in milliseconds) for which chaining remains active after being set to true.
     */
    private readonly chainingThreshold: number,
  ) {}

  set chaining(value: boolean) {
    if (typeof window === "undefined") return;
    this._chaining = value;
    if (this.chainingTimeout !== null) clearTimeout(this.chainingTimeout);

    if (value) {
      this.chainingTimeout = setTimeout(() => {
        this._chaining = false;
        this.chainingTimeout = null;
      }, this.chainingThreshold);
    }
  }

  get chaining() {
    return this._chaining;
  }
}
