/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { ButtonProps } from "@canonical/svelte-ds-app-launchpad";

export type CloseButtonProps = Omit<
  Extract<ButtonProps, { href?: never }>,
  "children" | "iconLeft" | "iconRight" | "severity" | "density"
>;
