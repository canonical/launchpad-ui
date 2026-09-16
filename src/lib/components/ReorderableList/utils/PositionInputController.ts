import type { ReorderableList } from "./ReorderableList.svelte.js";

/** Controls direct position editing for an item in a reorderable list. */
export class PositionInputController<T> {
  readonly #model: ReorderableList<T>;

  constructor(model: ReorderableList<T>) {
    this.#model = model;
  }

  onkeydown(
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
    key: string,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.#commit(event.currentTarget, key);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.#reset(event.currentTarget, key);
    }
  }

  onblur(event: FocusEvent & { currentTarget: HTMLInputElement }, key: string) {
    this.#commit(event.currentTarget, key);
  }

  #commit(node: HTMLInputElement, key: string) {
    if (this.#model.canStart()) {
      const requested = node.valueAsNumber;
      if (Number.isInteger(requested)) {
        this.#model.moveImmediate(key, requested - 1);
        return;
      }
    }

    this.#reset(node, key);
  }

  #reset(node: HTMLInputElement, key: string) {
    node.value = String(this.#model.indexOf(key) + 1);
  }
}
