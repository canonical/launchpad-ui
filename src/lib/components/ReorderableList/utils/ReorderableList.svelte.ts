import { onDestroy, tick } from "svelte";
import type { Attachment } from "svelte/attachments";
import { prefersReducedMotion } from "svelte/motion";

/** Collapses a burst of moves into a single, non-stale polite announcement. */
const ANNOUNCEMENT_THROTTLE_MS = 150;

export type ReorderableListOptions<T> = {
  items: () => T[];
  setItems: (items: T[]) => void;
  key: (item: T) => string;
  itemLabel: (item: T) => string;
  disabled: () => boolean;
  duration: () => number;
};

type ReorderableListAnnouncement = "grab" | "move" | "drop" | "cancel";
type ReorderableListActivity = "pointer" | "keyboard";

/** Shared state for a reorderable list; each input method is a separate controller. */
export class ReorderableList<T> {
  readonly #items: T[];
  readonly #setItems: (items: T[]) => void;
  readonly #key: (item: T) => string;
  readonly #itemLabel: (item: T) => string;

  readonly count: number;
  readonly disabled: boolean;
  readonly duration: number;

  // eslint-disable-next-line svelte/prefer-svelte-reactivity
  #elements = new Map<string, HTMLElement>();
  #announcementTimer: ReturnType<typeof setTimeout> | undefined;
  #activity: ReorderableListActivity | null = null;
  /** Set while a reorder moves the focused node, whose blur must be ignored. */
  #restoringFocus = false;

  #announcement = $state("");

  constructor(options: ReorderableListOptions<T>) {
    this.#items = $derived(options.items());
    this.count = $derived(this.#items.length);
    this.#setItems = options.setItems;
    this.#key = options.key;
    this.#itemLabel = options.itemLabel;
    this.disabled = $derived(options.disabled());
    this.duration = $derived(
      prefersReducedMotion.current ? 0 : options.duration(),
    );

    onDestroy(() => clearTimeout(this.#announcementTimer));
  }

  get activity() {
    return this.#activity;
  }

  get isRestoringFocus() {
    return this.#restoringFocus;
  }

  get announcement() {
    return this.#announcement;
  }

  claim(activity: ReorderableListActivity) {
    if (this.#activity !== null) return false;
    this.#activity = activity;
    return true;
  }

  release() {
    this.#activity = null;
  }

  indexOf(key: string) {
    return this.#items.findIndex((item) => this.#key(item) === key);
  }

  labelFor(key: string) {
    const item = this.#items[this.indexOf(key)];
    return item === undefined ? "" : this.#itemLabel(item);
  }

  elementFor(key: string) {
    return this.#elements.get(key);
  }

  elementAt(index: number) {
    const item = this.#items[index];
    return item === undefined ? undefined : this.#elements.get(this.#key(item));
  }

  /**
   * Moving an item in a keyed each block relocates its DOM node, which blurs
   * whatever was focused inside it, so focus is put back after the flush.
   */
  moveKeepingFocus(key: string, to: number) {
    const active = document.activeElement;
    const restore =
      active instanceof HTMLElement && this.elementFor(key)?.contains(active);

    if (restore) this.#restoringFocus = true;

    if (!this.#move(this.indexOf(key), to)) {
      this.#restoringFocus = false;
      return false;
    }

    if (restore) {
      void tick().then(() => {
        if (document.activeElement !== active) active.focus();
        this.#restoringFocus = false;
      });
    }

    return true;
  }

  announce(
    operation: ReorderableListAnnouncement,
    label: string,
    index: number,
  ) {
    let message: string;
    switch (operation) {
      case "grab":
        message = `Picked up ${label}. Position ${index + 1} of ${this.count}.`;
        break;
      case "move":
        message = `${label} moved to position ${index + 1} of ${this.count}.`;
        break;
      case "drop":
        message = `${label} dropped at position ${index + 1} of ${this.count}.`;
        break;
      case "cancel":
        message = `Reordering cancelled. ${label} returned to position ${index + 1} of ${this.count}.`;
        break;
    }

    clearTimeout(this.#announcementTimer);

    // Moves arrive in bursts, so only the settled position reaches the region.
    if (operation === "move") {
      this.#announcementTimer = setTimeout(() => {
        this.#announcement = message;
      }, ANNOUNCEMENT_THROTTLE_MS);
      return;
    }

    this.#announcement = message;
  }

  registerItem =
    (key: string): Attachment<HTMLElement> =>
    (node) => {
      this.#elements.set(key, node);
      return () => {
        if (this.#elements.get(key) === node) this.#elements.delete(key);
      };
    };

  #move(from: number, to: number) {
    const items = this.#items;
    if (from < 0 || to < 0 || to >= items.length || from === to) return false;

    const next = items.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    this.#setItems(next);

    return true;
  }
}
