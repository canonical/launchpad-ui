import type { AriaAttributes } from "svelte/elements";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractAria<T extends Record<string, any>>(
  props: T,
): [ariaProps: AriaAttributes, restProps: Omit<T, keyof AriaAttributes>] {
  const ariaProps: AriaAttributes = {};
  const restProps: Omit<T, keyof AriaAttributes> = { ...props };

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("aria-") || key === "role") {
      ariaProps[key as keyof AriaAttributes] = value;
      delete restProps[key];
    }
  }

  return [ariaProps, restProps];
}
