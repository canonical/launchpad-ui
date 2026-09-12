import { flushSync, onDestroy, untrack } from "svelte";
import type { Attachment } from "svelte/attachments";
import type { ReorderSession } from "./ReorderSession.svelte.js";

const ANNOUNCEMENT_THROTTLE_MS = 150;

export type ReorderableListOptions<T> = {
  items: () => T[];
  setItems: (items: T[]) => void;
  key: (item: T) => string;
  itemLabel: (item: T) => string;
  disabled: () => boolean;
};

type ReorderableListAnnouncement = "grab" | "move" | "drop" | "cancel";

export class ReorderableList<T> {
  readonly #items: T[];
  readonly #setItems: (items: T[]) => void;
  readonly #key: (item: T) => string;
  readonly #itemLabel: (item: T) => string;
  readonly disabled: boolean;

  // eslint-disable-next-line svelte/prefer-svelte-reactivity
  #elements = new Map<string, HTMLElement>();
  #announcementTimer: ReturnType<typeof setTimeout> | undefined;
  #session = $state<ReorderSession | null>(null);
  /** Set while a reorder moves the focused node, whose blur must be ignored. */
  #restoringFocus = false;
  #announcement = $state("");

  readonly count = $derived.by(() => this.#items.length);
  /** `items` with the in-progress move applied. This is what the list actually renders. */
  readonly displayItems = $derived.by(() => {
    const session = this.#session;
    if (!session) return this.#items;

    const from = this.#rawIndexOf(session.key);
    const to = this.#clamp(session.to);
    if (from === -1 || from === to) return this.#items;

    const next = this.#items.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  });

  constructor(options: ReorderableListOptions<T>) {
    this.#items = $derived(options.items());
    this.disabled = $derived(options.disabled());
    this.#setItems = options.setItems;
    this.#key = options.key;
    this.#itemLabel = options.itemLabel;

    onDestroy(() => {
      clearTimeout(this.#announcementTimer);
      this.discardSession();
    });

    // Discards the session if the list gets disabled or no longer contains the item being dragged.
    // Loop danger! Reads and writes session!
    $effect(() => {
      const session = this.#session;
      if (session === null) return;
      if (this.#gotInterrupted(session)) untrack(() => this.discardSession());
    });
  }

  /**
   * Check used to catch cases where during the session, the list:
   * - becomes disabled
   * - no longer contains the item being dragged
   */
  #gotInterrupted(session: ReorderSession) {
    return this.disabled || this.#rawIndexOf(session.key) === -1;
  }

  get session() {
    return this.#session;
  }

  get isRestoringFocus() {
    return this.#restoringFocus;
  }

  get announcement() {
    return this.#announcement;
  }

  /** Whether a new interaction may begin. */
  canStart() {
    return !this.disabled && this.#session === null;
  }

  indexOf(key: string) {
    return this.displayItems.findIndex((item) => this.#key(item) === key);
  }

  labelFor(key: string) {
    const item = this.displayItems[this.indexOf(key)];
    return item === undefined ? "" : this.#itemLabel(item);
  }

  elementFor(key: string) {
    return this.#elements.get(key);
  }

  elementAt(index: number) {
    const item = this.displayItems[index];
    return item === undefined ? undefined : this.#elements.get(this.#key(item));
  }

  begin(session: ReorderSession, silent = false) {
    const index = this.#rawIndexOf(session.key);
    if (index === -1 || !this.canStart()) return false;

    session.to = index;
    this.#session = session;

    if (!silent) this.announceGrab();
    return true;
  }

  announceGrab() {
    const session = this.#session;
    if (!session) return;

    this.#announce("grab", session.key, this.indexOf(session.key));
  }

  moveInSession(to: number) {
    const session = this.#session;
    if (!session) return false;

    const clamped = this.#clamp(to);
    if (clamped === session.to) return false;

    this.#keepingFocus(session.key, () => (session.to = clamped));
    this.#announce("move", session.key, clamped);

    return true;
  }

  commit() {
    const session = this.#session;
    // A blur fired by an element removal may occur before the effect ends a dead session.
    if (!session || this.#gotInterrupted(session)) {
      this.discardSession();
      return;
    }

    const next = this.displayItems;
    const index = this.indexOf(session.key);

    this.#keepingFocus(session.key, () => {
      this.#session = null;
      if (next !== this.#items) this.#setItems(next);
    });
    session.teardown();
    this.#announce("drop", session.key, index);
  }

  /** Ends the current session due to the users's cancellation. */
  cancelSession() {
    const session = this.#session;
    if (!session) return;
    else this.#keepingFocus(session.key, () => (this.#session = null));

    session.teardown();

    const origin = this.#rawIndexOf(session.key);
    if (origin !== -1) {
      this.#announce("cancel", session.key, origin);
    }
  }

  /** Ends the current session in case of an interruption. */
  discardSession() {
    const session = this.#session;
    if (!session) return;

    this.#session = null;
    session.teardown();
  }

  /** A one-off move without a session, written straight through to `items`. */
  moveImmediate(key: string, to: number) {
    const from = this.#rawIndexOf(key);
    const clamped = this.#clamp(to);
    if (from === -1 || from === clamped) return false;

    this.#keepingFocus(key, () => {
      const next = this.#items.slice();
      const [moved] = next.splice(from, 1);
      next.splice(clamped, 0, moved);
      this.#setItems(next);
    });
    this.#announce("move", key, clamped);

    return true;
  }

  #rawIndexOf(key: string) {
    return this.#items.findIndex((item) => this.#key(item) === key);
  }

  #clamp(index: number) {
    return Math.min(Math.max(index, 0), this.count - 1);
  }

  /**
   * Moving an item in a keyed each block moves the DOM node, which blurs whatever was focused inside it.
   * The move is flushed synchronously so focus is restored before any new events are delivered.
   *
   * I think that if Svelte used `moveBefore` instead, the focus would not be lost, and this whole thing could be dropped.
   * TODO: Keep an eye on the `moveBefore` availability and the Svelte's adoption of it (https://developer.mozilla.org/en-US/docs/Web/API/Element/moveBefore).
   */
  #keepingFocus(key: string, mutate: () => void) {
    const active = document.activeElement;
    const restore =
      active instanceof HTMLElement && this.elementFor(key)?.contains(active);

    if (!restore) {
      mutate();
      return;
    }

    this.#restoringFocus = true;
    try {
      flushSync(mutate);
      if (document.activeElement !== active) active.focus();
    } finally {
      this.#restoringFocus = false;
    }
  }

  #announce(
    operation: ReorderableListAnnouncement,
    key: string,
    index: number,
  ) {
    clearTimeout(this.#announcementTimer);

    // Moves may arrive in bursts, so debounce to announce only the settled position.
    if (operation === "move") {
      this.#announcementTimer = setTimeout(() => {
        const currentIndex = this.indexOf(key);
        if (currentIndex !== -1) {
          this.#announcement = `${this.labelFor(key)} moved to position ${currentIndex + 1} of ${this.count}.`;
        }
      }, ANNOUNCEMENT_THROTTLE_MS);
      return;
    }

    const label = this.labelFor(key);
    let message: string;
    switch (operation) {
      case "grab":
        message = `Picked up ${label}. Position ${index + 1} of ${this.count}.`;
        break;
      case "drop":
        message = `${label} dropped at position ${index + 1} of ${this.count}.`;
        break;
      case "cancel":
        message = `Reordering cancelled. ${label} returned to position ${index + 1} of ${this.count}.`;
        break;
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
}
