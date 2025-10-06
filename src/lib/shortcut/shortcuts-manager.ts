import type { Shortcut } from "./shortcut";

/**
 * Manages the shortcuts for an element.
 *
 * - It can register/unregister a list of shortcuts for an element.
 * - The list of shortcuts can be updated.
 */
export class ShortcutsManager<T extends HTMLElement> {
  constructor(public shortcuts: Shortcut<T>[] = []) {}

  add(shortcut: Shortcut<T>) {
    this.shortcuts.push(shortcut);
  }

  remove(shortcut: Shortcut<T>) {
    this.shortcuts = this.shortcuts.filter((s) => s !== shortcut);
  }

  set(shortcuts: Shortcut<T>[]) {
    this.shortcuts = shortcuts;
  }

  keydownHandler(event: KeyboardEvent, target: T) {
    this.shortcuts.forEach((shortcut) => {
      if (shortcut.match(event)) {
        shortcut.callback(target);
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  register(target: T) {
    target.addEventListener("keydown", (event) =>
      this.keydownHandler(event, target),
    );
  }

  unregister(target: T) {
    target.removeEventListener("keydown", (event) =>
      this.keydownHandler(event, target),
    );
  }
}
