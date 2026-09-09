import { onDestroy, tick } from "svelte";
import type { ReorderableList } from "./ReorderableList.svelte.js";

const DRAG_THRESHOLD_PX = 5;
// TODO: JS design tokens
const SETTLE_EASING = "cubic-bezier(0.2, 0, 0.2, 1)";

class PointerSession {
  readonly key: string;
  readonly pointerId: number;
  readonly pointerStartY: number;
  readonly scrollStartY: number;

  #drag = $state<{
    origin: number;
    startTop: number;
    currentTop: number;
  } | null>(null);
  #pointerY = $state(0);
  #scrollY = $state(0);

  /**
   * Pointer travel minus layout travel, so reordering the list mid-drag cannot pull the item out from under the pointer.
   */
  readonly offset = $derived(
    this.#drag
      ? this.#pointerTravel - (this.#drag.currentTop - this.#drag.startTop)
      : 0,
  );

  /** Where the item is drawn right now, independent of the slot it occupies. */
  readonly visualTop = $derived(
    this.#drag ? this.#drag.startTop + this.#pointerTravel : 0,
  );

  constructor(event: PointerEvent, key: string) {
    this.key = key;
    this.pointerId = event.pointerId;
    this.pointerStartY = event.clientY;
    this.#pointerY = event.clientY;
    this.scrollStartY = window.scrollY;
    this.#scrollY = window.scrollY;
  }

  get hasPassedThreshold() {
    return Math.abs(this.#pointerTravel) >= DRAG_THRESHOLD_PX;
  }

  get #pointerTravel() {
    return (
      this.#pointerY - this.pointerStartY + (this.#scrollY - this.scrollStartY)
    );
  }

  get isDragging() {
    return this.#drag !== null;
  }

  get drag() {
    return this.#drag ?? null;
  }

  startDrag(origin: number, top: number) {
    this.#drag = { origin: origin, startTop: top, currentTop: top };
  }

  updateDrag(currentTop: number) {
    if (this.#drag) {
      this.#drag.currentTop = currentTop;
    }
  }

  set pointerY(value: number) {
    this.#pointerY = value;
  }

  set scrollY(value: number) {
    this.#scrollY = value;
  }
}

export class PointerDragController<T> {
  readonly #model: ReorderableList<T>;

  #windowListeners: AbortController | null = null;
  #isSwappingItem = false;

  #pointerSession = $state<PointerSession | null>(null);
  #settlingItemKey = $state<string | null>(null);

  #draggingKey = $derived(
    this.#pointerSession?.isDragging ? this.#pointerSession.key : null,
  );

  constructor(model: ReorderableList<T>) {
    this.#model = model;

    onDestroy(() => this.#clearPointerSession());
  }

  isDragging(key: string) {
    return this.#draggingKey === key;
  }

  transformFor(key: string) {
    const session = this.#pointerSession;
    return session && this.#draggingKey === key
      ? `translateY(${session.offset}px)`
      : undefined;
  }

  flipDuration(key: string) {
    return this.isDragging(key) || this.#settlingItemKey === key
      ? 0
      : this.#model.duration;
  }

  onpointerdown(event: PointerEvent, key: string) {
    if (
      this.#model.disabled ||
      event.button !== 0 ||
      this.#pointerSession ||
      this.#model.activity !== null
    ) {
      return;
    }

    this.#windowListeners = new AbortController();
    this.#pointerSession = new PointerSession(event, key);

    const { signal } = this.#windowListeners;
    window.addEventListener("pointermove", this.#onPointerMove, {
      signal,
      passive: true,
    });
    window.addEventListener("pointerup", this.#onPointerUp, { signal });
    window.addEventListener("pointercancel", this.#onPointerCancel, { signal });
    window.addEventListener("keydown", this.#onWindowKeyDown, {
      signal,
      capture: true,
    });
    window.addEventListener("scroll", this.#onScroll, {
      signal,
      capture: true,
      passive: true,
    });
  }

  #clearPointerSession() {
    this.#windowListeners?.abort();
    this.#windowListeners = null;
    this.#pointerSession = null;
  }

  #onPointerMove = (event: PointerEvent) => {
    const session = this.#pointerSession;
    if (!session || event.pointerId !== session.pointerId) return;

    session.pointerY = event.clientY;

    if (!session.isDragging) {
      if (!session.hasPassedThreshold) return;

      const origin = this.#model.indexOf(session.key);
      const node = this.#model.elementFor(session.key);
      if (origin === -1 || !node || !this.#model.claim("pointer")) {
        this.#clearPointerSession();
        return;
      }

      session.startDrag(origin, node.offsetTop);
      this.#model.announce("grab", this.#model.labelFor(session.key), origin);
    }

    void this.#swapPastNeighbours();
  };

  #onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== this.#pointerSession?.pointerId) return;
    void this.#endDrag(true);
  };

  #onPointerCancel = (event: PointerEvent) => {
    if (event.pointerId !== this.#pointerSession?.pointerId) return;
    void this.#endDrag(false);
  };

  #onScroll = () => {
    const session = this.#pointerSession;
    if (!session) return;

    session.scrollY = window.scrollY;
    void this.#swapPastNeighbours();
  };

  #onWindowKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    void this.#endDrag(false);
  };

  async #swapPastNeighbours() {
    if (this.#isSwappingItem) return;
    this.#isSwappingItem = true;

    try {
      while (true) {
        const session = this.#pointerSession;
        if (!session?.isDragging) break;

        const node = this.#model.elementFor(session.key);
        const index = this.#model.indexOf(session.key);
        if (!node || index === -1) break;

        const centre = session.visualTop + node.offsetHeight / 2;
        const target = this.#newItemIndex(index, centre);
        if (target === index) break;

        if (!this.#model.moveKeepingFocus(session.key, target)) break;

        // Settle the DOM and re-calculate the position of the dragged item.
        await tick();
        if (this.#pointerSession !== session || !session.isDragging) break;
        session.updateDrag(node.offsetTop);

        this.#model.announce("move", this.#model.labelFor(session.key), target);
      }
    } finally {
      this.#isSwappingItem = false;
    }
  }

  #newItemIndex(index: number, centre: number) {
    const previous = this.#model.elementAt(index - 1);
    if (previous && centre < previous.offsetTop + previous.offsetHeight / 2) {
      return index - 1;
    }

    const next = this.#model.elementAt(index + 1);
    if (next && centre > next.offsetTop + next.offsetHeight / 2) {
      return index + 1;
    }

    return index;
  }

  async #endDrag(commit: boolean) {
    const session = this.#pointerSession;
    const drag = session?.drag;

    this.#clearPointerSession();
    if (!session || !drag) return;

    const { key, visualTop } = session;
    const node = this.#model.elementFor(key);
    const label = this.#model.labelFor(key);
    const index = this.#model.indexOf(key);

    this.#settlingItemKey = key;

    if (commit) {
      this.#model.announce("drop", label, index);
    } else {
      this.#model.moveKeepingFocus(key, drag.origin);
      this.#model.announce("cancel", label, drag.origin);
    }

    this.#model.release();
    await tick();

    if (node) this.#settle(node, visualTop - node.offsetTop);
    this.#settlingItemKey = null;
  }

  /** Animates the released item from where the pointer left it back to its slot. */
  #settle(node: HTMLElement, from: number) {
    const duration = this.#model.duration;
    if (duration === 0 || Math.abs(from) < 1) return;

    node.animate(
      [{ transform: `translateY(${from}px)` }, { transform: "none" }],
      { duration, easing: SETTLE_EASING },
    );
  }
}
