import type { ReorderableList } from "./ReorderableList.svelte.js";

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
    if (this.#model.isRestoringFocus) return;

    const requested = Number.parseInt(node.value, 10);
    if (Number.isFinite(requested)) {
      const to = Math.min(Math.max(requested, 1), this.#model.count) - 1;
      if (this.#model.moveKeepingFocus(key, to)) {
        this.#model.announce("move", this.#model.labelFor(key), to);
      }
    }

    this.#reset(node, key);
  }

  #reset(node: HTMLInputElement, key: string) {
    node.value = String(this.#model.indexOf(key) + 1);
  }
}
