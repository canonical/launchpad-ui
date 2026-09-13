import { tick, untrack } from "svelte";
import type { DragMode } from "../types.js";
import { ReorderSession } from "./ReorderSession.svelte.js";
import type { ReorderableList } from "./ReorderableList.svelte.js";
import { listCoordinates } from "./listCoordinates.js";

export type DragData = {
  rect: DOMRect;
  travel: number;
  key: string;
};

const DRAG_THRESHOLD_PX = 5;

class PointerSession extends ReorderSession {
  readonly pointerId: number;
  readonly pointerStartY: number;
  readonly listeners = new AbortController();

  readonly #draggedRect: DOMRect;
  readonly #captureElement: HTMLElement | undefined;
  readonly #onDragStart: () => void;

  #pointerY = $state(0);
  #dragStarted = $state(false);

  readonly #pointerTravel = $derived.by(
    () => this.#pointerY - this.pointerStartY,
  );

  readonly dragData: DragData | null = $derived.by(() =>
    this.#dragStarted
      ? { rect: this.#draggedRect, travel: this.#pointerTravel, key: this.key }
      : null,
  );

  /** Pointer and slot centres share the list's padding-box coordinate system. */
  centreIn(list: HTMLElement) {
    const initialCentre = this.#draggedRect.top + this.#draggedRect.height / 2;
    const centreInViewport = initialCentre + this.#pointerTravel;

    return listCoordinates(list).viewportToList(centreInViewport);
  }

  constructor(
    event: PointerEvent,
    key: string,
    captureElement: HTMLElement | undefined,
    draggedElement: HTMLElement,
    onDragStart: () => void,
  ) {
    super(key);
    this.pointerId = event.pointerId;
    this.pointerStartY = event.clientY;
    this.#pointerY = event.clientY;
    this.#captureElement = captureElement;
    this.#draggedRect = draggedElement.getBoundingClientRect();
    this.#onDragStart = onDragStart;
  }

  override teardown() {
    this.listeners.abort();

    if (this.#captureElement?.hasPointerCapture(this.pointerId)) {
      this.#captureElement.releasePointerCapture(this.pointerId);
    }
  }

  set pointerY(value: number) {
    this.#pointerY = value;

    if (
      !this.#dragStarted &&
      Math.abs(this.#pointerTravel) >= DRAG_THRESHOLD_PX
    ) {
      this.#dragStarted = true;
      this.#onDragStart();
    }
  }
}

export class PointerDragController<T> {
  readonly #model: ReorderableList<T>;
  readonly #listElement: HTMLElement | undefined;
  readonly #dragMode: DragMode;
  #isSwappingItem = false;

  readonly #session = $derived.by(() => {
    const session = this.#model.session;
    return session instanceof PointerSession ? session : null;
  });

  readonly dragged = $derived(this.#session?.dragData);

  readonly dropIndicator = $derived.by(() => {
    const session = this.#session;
    if (!session?.dragData || this.#dragMode !== "drop-indicator") return null;

    const origin = this.#model.elements.indexOf(
      this.#model.elementFor(session.key),
    );
    const target = this.#model.indexOf(session.key);
    if (origin === -1 || target === -1 || target === origin) return null;

    return { index: target, edge: target < origin ? "before" : "after" };
  });

  #draggingKey = $derived.by(() => {
    const session = this.#session;
    return session?.dragData ? session.key : null;
  });

  constructor(
    model: ReorderableList<T>,
    listElement: () => HTMLElement | undefined,
    dragMode: () => DragMode,
  ) {
    this.#model = model;
    this.#listElement = $derived(listElement());
    this.#dragMode = $derived(dragMode());

    // Discard the current drag session if the drag mode changes.
    $effect(() => {
      void this.#dragMode;
      untrack(() => this.#session && this.#model.discardSession());
    });
  }

  isDragging(key?: string) {
    if (key === undefined) return this.#draggingKey !== null;
    return this.#draggingKey === key;
  }

  onpointerdown(event: PointerEvent, key: string) {
    if (event.button !== 0) return;

    const node = this.#model.elementFor(key);
    if (!node) return;

    const session = new PointerSession(
      event,
      key,
      this.#listElement,
      node,
      () => this.#model.announceGrab(),
    );
    if (!this.#model.begin(session, true)) return;

    try {
      this.#listElement?.setPointerCapture(event.pointerId);
    } catch {
      // Browsers can reject synthetic or already-ended pointers.
      // Non-critical: pointer events are still registered on the list.
    }

    const { signal } = session.listeners;
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

  onpointermove = (event: PointerEvent) => {
    const session = this.#session;
    if (!session || event.pointerId !== session.pointerId) return;
    session.pointerY = event.clientY;

    this.#syncReorder();
  };

  onpointerup = (event: PointerEvent) => {
    if (event.pointerId !== this.#session?.pointerId) return;
    this.#endDrag(true);
  };

  onpointercancel = (event: PointerEvent) => {
    if (event.pointerId !== this.#session?.pointerId) return;
    this.#endDrag(false);
  };

  onlostpointercapture = (event: PointerEvent) => {
    if (event.pointerId !== this.#session?.pointerId) return;
    this.#endDrag(false);
  };

  onblur = (key: string) => {
    if (!this.isDragging(key)) return;
    if (this.#model.isRestoringFocus) return;
    this.#endDrag(false);
  };

  #onScroll = () => {
    const session = this.#session;
    if (!session) return;

    this.#syncReorder();
  };

  #onWindowKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    this.#endDrag(false);
  };

  #syncReorder() {
    if (this.#dragMode === "preview") {
      void this.#updatePreviewMode();
    } else {
      this.#updateDropIndicatorMode();
    }
  }

  #updateDropIndicatorMode() {
    const session = this.#session;
    if (!session || !this.#listElement) return;

    const node = this.#model.elementFor(session.key);
    const centre = session.centreIn(this.#listElement);

    // Count the remaining rows above the dragged centre. This is the
    // final index after removing the source row and inserting it again.
    const target = this.#model.elements.filter(
      (element) =>
        element &&
        element !== node &&
        centre > element.offsetTop + element.offsetHeight / 2,
    ).length;
    this.#model.moveInSession(target);
  }

  async #updatePreviewMode() {
    if (this.#isSwappingItem) return;
    this.#isSwappingItem = true;

    try {
      while (true) {
        const session = this.#session;
        if (!session?.dragData) break;

        const node = this.#model.elementFor(session.key);
        const index = this.#model.indexOf(session.key);
        if (!node || index === -1 || !this.#listElement) break;

        const centre = session.centreIn(this.#listElement);
        const target = this.#newItemIndex(index, centre);
        if (target === index) break;

        if (!this.#model.moveInSession(target)) break;

        // Wait for the new slot geometry before checking the next neighbour.
        await tick();
        if (this.#session !== session) break;
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

  #endDrag(commit: boolean) {
    const session = this.#session;
    if (!session) return;

    if (!session.dragData) {
      this.#model.discardSession();
      return;
    }

    if (commit) this.#model.commit();
    else this.#model.cancelSession();
  }
}
