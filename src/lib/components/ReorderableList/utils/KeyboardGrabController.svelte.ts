import { ReorderSession } from "./ReorderSession.svelte.js";
import type { ReorderableList } from "./ReorderableList.svelte.js";

class KeyboardSession extends ReorderSession {
  readonly kind = "grab";
}

export class KeyboardGrabController<T> {
  readonly #model: ReorderableList<T>;

  constructor(model: ReorderableList<T>) {
    this.#model = model;
  }

  isGrabbed(key: string) {
    const session = this.#model.session;
    return session?.kind === "grab" && session?.key === key;
  }

  onkeydown(event: KeyboardEvent, key: string) {
    if (this.#model.disabled) return;

    const index = this.#model.indexOf(key);
    if (index === -1) return;

    if (this.isGrabbed(key)) {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          this.#model.moveInSession(index - 1);
          return;
        case "ArrowDown":
          event.preventDefault();
          this.#model.moveInSession(index + 1);
          return;
        case "Home":
          event.preventDefault();
          this.#model.moveInSession(0);
          return;
        case "End":
          event.preventDefault();
          this.#model.moveInSession(this.#model.count - 1);
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
      this.#model.begin(new KeyboardSession(key));
    }
  }

  onblur(key: string) {
    if (!this.#model.isRestoringFocus && this.isGrabbed(key)) {
      this.#model.commit();
    }
  }
}
