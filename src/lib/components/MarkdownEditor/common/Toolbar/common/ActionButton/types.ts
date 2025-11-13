/* @canonical/generator-ds 0.10.0-experimental.3 */
import type { Snippet } from "svelte";
import type { ButtonProps } from "$lib/components/Button/index.js";
import type { Shortcut } from "$lib/shortcuts/index.js";

export type ActionButtonProps = Omit<
  ButtonProps,
  "children" | "iconLeft" | "iconRight" | "density" | "severity"
> & {
  /**
   * The icon to show for the action
   */
  children: Snippet<[]>;

  /**
   * The label to show for the action
   */
  label: string;

  /**
   * The shortcut associated with the action.
   */
  shortcut?: Shortcut;
};
