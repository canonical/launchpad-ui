import { tick } from "svelte";
import type { DragMode } from "../types.js";
import { Reorder } from "./Reorder.svelte.js";
import type { ReorderableList } from "./ReorderableList.svelte.js";
import { listCoordinates } from "./listCoordinates.js";

/** Coordinates pointer-driven reordering and exposes its current drag state. */
export class DragController<T> {
  readonly #model: ReorderableList<T>;
  readonly #listElement: HTMLElement | undefined;
  readonly #dragMode: DragMode;
  #isSwappingItem = false;

  readonly #pendingDragReorder = $derived.by(() => {
    const pendingReorder = this.#model.pendingReorder;
    return pendingReorder instanceof DragReorder ? pendingReorder : null;
  });

  readonly dragData = $derived(this.#pendingDragReorder?.dragData);

  /** Drop indicator position when using drop-indicator mode, otherwise `null`. */
  readonly dropIndicator = $derived.by(() => {
    const pendingReorder = this.#pendingDragReorder;
    if (!pendingReorder?.dragData || this.#dragMode !== "drop-indicator")
      return null;

    const origin = this.#model.elements.indexOf(
      this.#model.elementFor(pendingReorder.key),
    );
    const target = this.#model.indexOf(pendingReorder.key);
    if (origin === -1 || target === -1 || target === origin) return null;

    return { index: target, edge: target < origin ? "before" : "after" };
  });

  #draggingKey = $derived(
    this.#pendingDragReorder?.dragData ? this.#pendingDragReorder.key : null,
  );

  constructor(
    model: ReorderableList<T>,
    listElement: () => HTMLElement | undefined,
    dragMode: () => DragMode,
  ) {
    this.#model = model;
    this.#listElement = $derived(listElement());
    this.#dragMode = $derived(dragMode());
  }

  isDragging(key?: string) {
    if (key === undefined) return this.#draggingKey !== null;
    return this.#draggingKey === key;
  }

  onpointerdown(event: PointerEvent, key: string) {
    if (event.button !== 0) return;

    const node = this.#model.elementFor(key);
    if (!node) return;

    const pendingReorder = new DragReorder(
      event,
      key,
      this.#listElement,
      node,
      () => this.#model.announceGrab(),
    );

    const didStartPendingReorder = this.#model.start(pendingReorder, true);
    if (!didStartPendingReorder) return;

    try {
      this.#listElement?.setPointerCapture(event.pointerId);
    } catch {
      // Browsers can reject synthetic or already-ended pointers.
      // Non-critical: pointer events are still registered on the list.
    }

    const { signal } = pendingReorder.listeners;
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
    const pendingReorder = this.#pendingDragReorder;
    if (!pendingReorder || event.pointerId !== pendingReorder.pointerId) return;
    pendingReorder.pointerY = event.clientY;

    this.#syncReorder();
  };

  onpointerup = (event: PointerEvent) => {
    if (event.pointerId !== this.#pendingDragReorder?.pointerId) return;
    this.#endDrag(true);
  };

  onpointercancel = (event: PointerEvent) => {
    if (event.pointerId !== this.#pendingDragReorder?.pointerId) return;
    this.#endDrag(false);
  };

  onlostpointercapture = (event: PointerEvent) => {
    if (event.pointerId !== this.#pendingDragReorder?.pointerId) return;
    this.#endDrag(false);
  };

  onblur = (key: string) => {
    if (!this.isDragging(key)) return;
    if (this.#model.isRestoringFocus) return;
    this.#endDrag(false);
  };

  #onScroll = () => {
    const pendingReorder = this.#pendingDragReorder;
    if (!pendingReorder) return;

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
    const pendingReorder = this.#pendingDragReorder;
    if (!pendingReorder || !this.#listElement) return;

    const node = this.#model.elementFor(pendingReorder.key);
    const centre = pendingReorder.centreIn(this.#listElement);

    // Count the remaining rows above the dragged centre. This is the
    // final index after removing the source row and inserting it again.
    const target = this.#model.elements.filter(
      (element) =>
        element &&
        element !== node &&
        centre > element.offsetTop + element.offsetHeight / 2,
    ).length;
    this.#model.movePendingReorder(target);
  }

  async #updatePreviewMode() {
    if (this.#isSwappingItem) return;
    this.#isSwappingItem = true;

    try {
      while (true) {
        const pendingReorder = this.#pendingDragReorder;
        if (!pendingReorder?.dragData) break;

        const node = this.#model.elementFor(pendingReorder.key);
        const index = this.#model.indexOf(pendingReorder.key);
        if (!node || index === -1 || !this.#listElement) break;

        const centre = pendingReorder.centreIn(this.#listElement);
        const target = this.#newItemIndex(index, centre);
        if (target === index) break;

        if (!this.#model.movePendingReorder(target)) break;

        // Wait for the new slot geometry before checking the next neighbour.
        await tick();
        if (this.#pendingDragReorder !== pendingReorder) break;
      }
    } finally {
      this.#isSwappingItem = false;
    }
  }

  /** Determine whether the item should move one position up or down based on the pointer's centre.
   *
   * @returns The new index for the item or the same index if it should not move.
   */
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
    const pendingReorder = this.#pendingDragReorder;
    if (!pendingReorder) return;

    if (!pendingReorder.dragData) {
      this.#model.discard();
      return;
    }

    if (commit) this.#model.commit();
    else this.#model.cancel();
  }
}

export type DragData = {
  /** The dragged element's initial bounds in viewport coordinates. */
  rect: DOMRect;
  /** Vertical distance travelled from the initial pointer position. */
  travel: number;
  key: string;
};

/**
 * The minimum pointer travel distance before a drag is considered started.
 */
const DRAG_THRESHOLD_PX = 5;

/** Tracks pointer movement and position for an in-progress drag reorder. */
class DragReorder extends Reorder {
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

  /** Drag geometry and item identity, or `null` until the drag threshold is reached. */
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
