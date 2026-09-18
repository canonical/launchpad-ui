import { Reorder } from "./Reorder.svelte.js";
import type { ReorderableList } from "./ReorderableList.svelte.js";

/** Coordinates keyboard-driven reordering for a reorderable list. */
export class KeyboardController<T> {
  readonly #model: ReorderableList<T>;

  constructor(model: ReorderableList<T>) {
    this.#model = model;
  }

  isGrabbed(key: string) {
    const pendingReorder = this.#model.pendingReorder;
    return (
      pendingReorder instanceof KeyboardReorder && pendingReorder.key === key
    );
  }

  onkeydown(event: KeyboardEvent, key: string) {
    if (this.#model.disabled) return;

    const index = this.#model.indexOf(key);
    if (index === -1) return;

    if (this.isGrabbed(key)) {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          this.#model.movePendingReorder(index - 1);
          return;
        case "ArrowDown":
          event.preventDefault();
          this.#model.movePendingReorder(index + 1);
          return;
        case "Home":
          event.preventDefault();
          this.#model.movePendingReorder(0);
          return;
        case "End":
          event.preventDefault();
          this.#model.movePendingReorder(this.#model.itemsCount - 1);
          return;
        case "Enter":
        case " ":
          event.preventDefault();
          this.#model.commit();
          return;
        case "Escape":
          event.preventDefault();
          event.stopPropagation();
          this.#model.cancel();
          return;
        default:
          return;
      }
    }

    if (
      event.altKey &&
      (event.key === "ArrowUp" || event.key === "ArrowDown")
    ) {
      event.preventDefault();
      event.stopPropagation();
      if (!this.#model.canStart()) return;

      this.#model.moveImmediate(
        key,
        event.key === "ArrowUp" ? index - 1 : index + 1,
      );
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.#model.start(new KeyboardReorder(key));
    }
  }

  onblur(key: string) {
    if (!this.#model.isRestoringFocus && this.isGrabbed(key)) {
      this.#model.commit();
    }
  }
}

class KeyboardReorder extends Reorder {}
