import { tick } from "svelte";
import type { Attachment } from "svelte/attachments";
import { SvelteSet } from "svelte/reactivity";
import { ReorderSession } from "./ReorderSession.svelte.js";
import type { ReorderableList } from "./ReorderableList.svelte.js";

const DRAG_THRESHOLD_PX = 5;
// TODO: JS design tokens
const SETTLE_EASING = "cubic-bezier(0.2, 0, 0.2, 1)";

class PointerSession extends ReorderSession {
  readonly kind = "drag";
  readonly pointerId: number;
  readonly pointerStartY: number;
  readonly scrollStartY: number;
  readonly listeners = new AbortController();

  readonly #scrollContainers: Element[];
  readonly #captureElement: Element | null;

  #pointerY = $state(0);
  #scrollY = $state(0);
  #dragged = $state<{ startTop: number; currentTop: number }>();

  /** Pointer travel minus layout travel, so reordering the list mid-drag cannot pull the item out from under the pointer. */
  readonly offset = $derived.by(() => {
    if (!this.#dragged) return 0;
    return (
      this.pointerTravel - (this.#dragged.currentTop - this.#dragged.startTop)
    );
  });
  readonly pointerTravel = $derived.by(
    () =>
      this.#pointerY - this.pointerStartY + (this.#scrollY - this.scrollStartY),
  );
  readonly hasPassedThreshold = $derived.by(
    () => Math.abs(this.pointerTravel) >= DRAG_THRESHOLD_PX,
  );
  /** Where the item is drawn right now, independent of the slot it occupies. */
  readonly visualTop = $derived.by(() =>
    this.#dragged ? this.#dragged.startTop + this.pointerTravel : 0,
  );

  get dragged() {
    return this.#dragged;
  }

  constructor(
    event: PointerEvent,
    key: string,
    captureElement: Element | null,
  ) {
    super(key);
    this.pointerId = event.pointerId;
    this.pointerStartY = event.clientY;
    this.#pointerY = event.clientY;
    this.#captureElement = captureElement;
    this.#scrollContainers = scrollContainersFor(event.target);
    this.scrollStartY = scrollYFor(this.#scrollContainers);
    this.#scrollY = this.scrollStartY;
  }

  override teardown() {
    this.listeners.abort();

    if (this.#captureElement?.hasPointerCapture(this.pointerId)) {
      this.#captureElement.releasePointerCapture(this.pointerId);
    }
  }

  startDrag(top: number) {
    this.#dragged = { startTop: top, currentTop: top };
  }

  updateDragged(currentTop: number) {
    if (this.#dragged) {
      this.#dragged.currentTop = currentTop;
    }
  }

  set pointerY(value: number) {
    this.#pointerY = value;
  }

  updateScrollY() {
    this.#scrollY = scrollYFor(this.#scrollContainers);
  }
}

function scrollContainersFor(target: EventTarget | null) {
  if (!(target instanceof Element)) return [];

  const containers: Element[] = [];
  for (
    let element = target.parentElement;
    element;
    element = element.parentElement
  ) {
    if (element.scrollHeight > element.clientHeight) containers.push(element);
  }

  return containers;
}

function scrollYFor(containers: Element[]) {
  return containers.reduce(
    (scrollY, container) => scrollY + container.scrollTop,
    window.scrollY,
  );
}

export class PointerDragController<T> {
  readonly #model: ReorderableList<T>;
  readonly #animationDuration: number;

  listElement: Element | null = null;
  #isSwappingItem = false;

  #settlingItems = new SvelteSet<string>();

  readonly #session = $derived.by(() => {
    const session = this.#model.session;
    return session instanceof PointerSession ? session : null;
  });

  #draggingKey = $derived.by(() => {
    const session = this.#session;
    return session?.dragged ? session.key : null;
  });

  constructor(model: ReorderableList<T>, animationDuration: () => number) {
    this.#model = model;
    this.#animationDuration = $derived(animationDuration());
  }

  isDragging(key?: string) {
    if (key === undefined) return this.#draggingKey !== null;
    return this.#draggingKey === key;
  }

  dragStateFor(key: string) {
    return this.#draggingKey === key
      ? "dragging"
      : this.#settlingItems.has(key)
        ? "settling"
        : undefined;
  }

  transformFor(key: string) {
    const session = this.#session;
    return session && this.#draggingKey === key
      ? `translateY(${session.offset}px)`
      : undefined;
  }

  registerList: Attachment<HTMLElement> = (node) => {
    this.listElement = node;
    return () => {
      if (this.listElement === node) this.listElement = null;
    };
  };

  onpointerdown(event: PointerEvent, key: string) {
    if (event.button !== 0) return;

    const session = new PointerSession(event, key, this.listElement);
    if (!this.#model.begin(session, true)) return;

    try {
      this.listElement?.setPointerCapture(event.pointerId);
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

    if (!session.dragged) {
      if (!session.hasPassedThreshold) return;

      const node = this.#model.elementFor(session.key);
      if (!node) {
        this.#model.cancel(true);
        return;
      }

      session.startDrag(node.offsetTop);
      this.#model.announceGrab();
    }

    void this.#swapPastNeighbours();
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

  #onScroll = () => {
    const session = this.#session;
    if (!session) return;

    session.updateScrollY();
    void this.#swapPastNeighbours();
  };

  #onWindowKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    this.#endDrag(false);
  };

  async #swapPastNeighbours() {
    if (this.#isSwappingItem) return;
    this.#isSwappingItem = true;

    try {
      while (true) {
        const session = this.#session;
        if (!session?.dragged) break;

        const node = this.#model.elementFor(session.key);
        const index = this.#model.indexOf(session.key);
        if (!node || index === -1) break;

        const centre = session.visualTop + node.offsetHeight / 2;
        const target = this.#newItemIndex(index, centre);
        if (target === index) break;

        if (!this.#model.moveInSession(target)) break;

        // Settle the DOM and re-calculate the position of the dragged item.
        await tick();
        if (this.#session !== session) break;
        session.updateDragged(node.offsetTop);
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

    if (!session.dragged) {
      this.#model.cancel(true);
      return;
    }

    this.#settlingItems.add(session.key);

    if (commit) this.#model.commit();
    else this.#model.cancel();

    void this.#settleSession(session);
  }

  /** Animates the released item from where the pointer left it back to its slot. */
  async #settleSession(session: PointerSession) {
    await tick();

    const node = this.#model.elementFor(session.key);
    if (node) await this.#settle(node, session.visualTop - node.offsetTop);

    this.#settlingItems.delete(session.key);
  }

  async #settle(node: HTMLElement, from: number) {
    if (this.#animationDuration === 0 || Math.abs(from) < 1) return;

    const animation = node.animate(
      [{ transform: `translateY(${from}px)` }, { transform: "none" }],
      { duration: this.#animationDuration, easing: SETTLE_EASING },
    );

    await animation.finished.catch(() => {});
  }
}
