import type { ReorderableList } from "./ReorderableList.svelte.js";

export class KeyboardGrabController<T> {
  readonly #model: ReorderableList<T>;

  #grabbed = $state<{ key: string; origin: number } | null>(null);

  constructor(model: ReorderableList<T>) {
    this.#model = model;
  }

  isGrabbed(key: string) {
    return this.#grabbed?.key === key;
  }

  onkeydown(event: KeyboardEvent, key: string) {
    if (this.#model.disabled || this.#model.activity === "pointer") return;

    const index = this.#model.indexOf(key);
    if (index === -1) return;

    if (this.isGrabbed(key)) {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          this.#move(key, index - 1);
          return;
        case "ArrowDown":
          event.preventDefault();
          this.#move(key, index + 1);
          return;
        case "Home":
          event.preventDefault();
          this.#move(key, 0);
          return;
        case "End":
          event.preventDefault();
          this.#move(key, this.#model.count - 1);
          return;
        case "Enter":
        case " ":
          event.preventDefault();
          this.#drop();
          return;
        case "Escape":
          event.preventDefault();
          event.stopPropagation();
          this.#cancel();
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
      this.#move(key, event.key === "ArrowUp" ? index - 1 : index + 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!this.#model.claim("keyboard")) return;

      this.#grabbed = { key, origin: index };
      this.#model.announce("grab", this.#model.labelFor(key), index);
    }
  }

  onblur(key: string) {
    if (!this.#model.isRestoringFocus && this.isGrabbed(key)) this.#drop();
  }

  #move(key: string, to: number) {
    if (!this.#model.moveKeepingFocus(key, to)) return;
    this.#model.announce("move", this.#model.labelFor(key), to);
  }

  #drop() {
    const grabbed = this.#grabbed;
    if (!grabbed) return;

    this.#grabbed = null;
    this.#model.release();

    this.#model.announce(
      "drop",
      this.#model.labelFor(grabbed.key),
      this.#model.indexOf(grabbed.key),
    );
  }

  #cancel() {
    const grabbed = this.#grabbed;
    if (!grabbed) return;

    this.#grabbed = null;
    this.#model.release();

    this.#model.moveKeepingFocus(grabbed.key, grabbed.origin);
    this.#model.announce(
      "cancel",
      this.#model.labelFor(grabbed.key),
      grabbed.origin,
    );
  }
}
