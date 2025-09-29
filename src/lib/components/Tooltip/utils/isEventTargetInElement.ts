export function isEventTargetInElement(
  eventTarget: EventTarget | null,
  element: HTMLElement | undefined,
) {
  return Boolean(
    element &&
      eventTarget &&
      eventTarget instanceof Node &&
      (eventTarget === element || element.contains(eventTarget)),
  );
}
