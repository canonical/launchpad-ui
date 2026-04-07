/* @canonical/generator-ds 0.10.0-experimental.3 */
import type { ButtonProps } from "@canonical/svelte-ds-app-launchpad";
import type { Snippet } from "svelte";
import type { Shortcut } from "$lib/shortcuts/index.js";

export type ActionButtonProps = Omit<
  Extract<ButtonProps, { href?: never }>,
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
