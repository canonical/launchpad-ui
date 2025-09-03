/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { ButtonProps } from "$lib/components/Button/index.js";

export type CloseButtonProps = Omit<
  ButtonProps,
  "children" | "iconLeft" | "iconRight"
>;
