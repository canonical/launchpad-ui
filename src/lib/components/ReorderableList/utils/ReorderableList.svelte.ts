import { flushSync, onDestroy, untrack } from "svelte";
import type { Attachment } from "svelte/attachments";
import type { Reorder } from "./Reorder.svelte.js";

const ANNOUNCEMENT_DEBOUNCE_MS = 150;

/**
 * Coordinates the state of an item's reorder interaction.
 *
 * While an item is being moved, the list exposes the proposed order without
 * changing the caller's items. The move can then be committed, cancelled, or
 * discarded if the interaction is interrupted. The same model is shared by
 * all downstream controllers. Only one reorder interaction can be in progress
 * at a time.
 */
export class ReorderableList<T> {
  readonly #items: T[];
  readonly #setItems: (items: T[]) => void;
  readonly #key: (item: T) => string;
  readonly #itemLabel: (item: T) => string;
  readonly disabled: boolean;

  /** Item root elements, stored by item key. */
  // eslint-disable-next-line svelte/prefer-svelte-reactivity
  #elements = new Map<string, HTMLLIElement>();
  #announcementTimer: ReturnType<typeof setTimeout> | undefined;
  #pendingReorder = $state<Reorder | null>(null);
  #restoringFocus = false;
  #announcement = $state("");

  readonly itemsCount = $derived.by(() => this.#items.length);
  /** Items with the pending reorder applied, or the original items if no reorder is pending. */
  readonly itemsWithPendingReorder = $derived.by(() => {
    const pendingReorder = this.#pendingReorder;
    if (!pendingReorder) return this.#items;

    const from = this.#rawIndexOf(pendingReorder.key);
    const to = this.#clamp(pendingReorder.to);
    if (from === -1 || from === to) return this.#items;

    const next = this.#items.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  });

  constructor(options: {
    items: () => T[];
    setItems: (items: T[]) => void;
    key: (item: T) => string;
    itemLabel: (item: T) => string;
    disabled: () => boolean;
  }) {
    this.#items = $derived(options.items());
    this.disabled = $derived(options.disabled());
    this.#setItems = options.setItems;
    this.#key = options.key;
    this.#itemLabel = options.itemLabel;

    onDestroy(() => {
      clearTimeout(this.#announcementTimer);
      this.discardPendingReorder();
    });

    // Discards the pending reorder if the list gets disabled or no longer contains the item being dragged.
    // Loop danger! Reads and writes pending reorder!
    $effect(() => {
      const pendingReorder = this.#pendingReorder;
      if (pendingReorder === null) return;
      if (this.#gotInterrupted(pendingReorder))
        untrack(() => this.discardPendingReorder());
    });
  }

  #gotInterrupted(pendingReorder: Reorder) {
    return this.disabled || this.#rawIndexOf(pendingReorder.key) === -1;
  }

  /** The pending reorder, or `null` when no reorder interaction is pending. */
  get pendingReorder() {
    return this.#pendingReorder;
  }

  /** Whether focus is being restored after Svelte moves a keyed DOM node. */
  get isRestoringFocus() {
    return this.#restoringFocus;
  }

  /** Text for the list's live region. */
  get announcement() {
    return this.#announcement;
  }

  /** Whether a new reorder may begin. */
  canStart() {
    return !this.disabled && this.#pendingReorder === null;
  }

  /** Gets the index of an item within items respecting the pending reorder if one exists. */
  indexOf(key: string) {
    return this.itemsWithPendingReorder.findIndex(
      (item) => this.#key(item) === key,
    );
  }

  /** Gets an item's screen-reader label, or an empty string if it is gone. */
  labelFor(key: string) {
    const item = this.#items.find((item) => this.#key(item) === key);
    return item === undefined ? "" : this.#itemLabel(item);
  }

  /** Gets the registered root element for an item. */
  elementFor(key: string) {
    return this.#elements.get(key);
  }

  /** Registered item elements in items order. Ignores the pending reorder. */
  get elements() {
    return this.#items.map((item) => this.#elements.get(this.#key(item)));
  }

  /** Gets the registered item element at an index in items with the pending reorder applied. */
  elementAt(index: number) {
    const item = this.itemsWithPendingReorder[index];
    return item === undefined ? undefined : this.#elements.get(this.#key(item));
  }

  /**
   * Starts a new reorder.
   *
   * @param silent Whether to suppress the initial grab announcement. Pointer
   * dragging uses this until the movement threshold is crossed.
   * @returns Whether a new reorder was started.
   */
  begin(reorder: Reorder, silent = false) {
    const index = this.#rawIndexOf(reorder.key);
    if (index === -1 || !this.canStart()) return false;

    reorder.to = index;
    this.#pendingReorder = reorder;

    if (!silent) this.announceGrab();
    return true;
  }

  announceGrab() {
    const pendingReorder = this.#pendingReorder;
    if (!pendingReorder) return;

    this.#announce(
      "grab",
      pendingReorder.key,
      this.indexOf(pendingReorder.key),
    );
  }

  /**
   * Changes the pending item's position.
   *
   * @returns Whether the position changed.
   */
  movePendingReorder(to: number) {
    const pendingReorder = this.#pendingReorder;
    if (!pendingReorder) return false;

    const clamped = this.#clamp(to);
    if (clamped === pendingReorder.to) return false;

    this.#keepingFocus(pendingReorder.key, () => (pendingReorder.to = clamped));
    this.#announce("move", pendingReorder.key, clamped);

    return true;
  }

  /** Applies the pending reorder, clears it, and announces the drop. */
  commit() {
    const pendingReorder = this.#pendingReorder;
    // A blur fired by an element removal may occur before the effect ends a dead reorder.
    if (!pendingReorder || this.#gotInterrupted(pendingReorder)) {
      this.discardPendingReorder();
      return;
    }

    const next = this.itemsWithPendingReorder;
    const index = this.indexOf(pendingReorder.key);

    this.#keepingFocus(pendingReorder.key, () => {
      this.#pendingReorder = null;
      if (next !== this.#items) this.#setItems(next);
    });
    pendingReorder.teardown();
    this.#announce("drop", pendingReorder.key, index);
  }

  /** Leaves `items` unchanged and announces cancellation of the pending reorder. */
  cancelPendingReorder() {
    const pendingReorder = this.#pendingReorder;
    if (!pendingReorder) return;
    else
      this.#keepingFocus(
        pendingReorder.key,
        () => (this.#pendingReorder = null),
      );

    pendingReorder.teardown();

    const origin = this.#rawIndexOf(pendingReorder.key);
    if (origin !== -1) {
      this.#announce("cancel", pendingReorder.key, origin);
    }
  }

  /** Discards an interrupted pending reorder without an announcement. */
  discardPendingReorder() {
    const pendingReorder = this.#pendingReorder;
    if (!pendingReorder) return;

    this.#pendingReorder = null;
    pendingReorder.teardown();
  }

  /**
   * Moves an item in `items` without creating a pending reorder.
   *
   * @returns Whether the item moved.
   */
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
    return Math.min(Math.max(index, 0), this.itemsCount - 1);
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
    operation: "grab" | "move" | "drop" | "cancel",
    key: string,
    index: number,
  ) {
    clearTimeout(this.#announcementTimer);

    // Moves may arrive in bursts, so debounce to announce only the settled position.
    if (operation === "move") {
      this.#announcementTimer = setTimeout(() => {
        const currentIndex = this.indexOf(key);
        if (currentIndex !== -1) {
          this.#announcement = `${this.labelFor(key)} moved to position ${currentIndex + 1} of ${this.itemsCount}.`;
        }
      }, ANNOUNCEMENT_DEBOUNCE_MS);
      return;
    }

    const label = this.labelFor(key);
    let message: string;
    switch (operation) {
      case "grab":
        message = `Picked up ${label}. Position ${index + 1} of ${this.itemsCount}.`;
        break;
      case "drop":
        message = `${label} dropped at position ${index + 1} of ${this.itemsCount}.`;
        break;
      case "cancel":
        message = `Reordering cancelled. ${label} returned to position ${index + 1} of ${this.itemsCount}.`;
        break;
    }

    this.#announcement = message;
  }

  /** Returns an attachment that tracks an item's current root element. */
  registerItem =
    (key: string): Attachment<HTMLLIElement> =>
    (node) => {
      this.#elements.set(key, node);
      return () => {
        if (this.#elements.get(key) === node) this.#elements.delete(key);
      };
    };
}
