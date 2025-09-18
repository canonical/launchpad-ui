import type { AriaAttributes, AriaRole } from "svelte/elements";

interface AriaProps extends AriaAttributes {
  role?: AriaRole | null | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractAria<T extends Record<string, any>>(
  props: T,
): [ariaProps: AriaProps, restProps: Omit<T, keyof AriaProps>] {
  const ariaProps: AriaProps = {};
  const restProps: Omit<T, keyof AriaProps> = { ...props };

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("aria-") || key === "role") {
      ariaProps[key as keyof AriaProps] = value;
      delete restProps[key];
    }
  }

  return [ariaProps, restProps];
}
