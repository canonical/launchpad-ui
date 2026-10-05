/** Called when a filter control picks a new value. */
export type FilterChangeHandler<T> = (
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
  value: T,
) => void;
