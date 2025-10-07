/* @canonical/generator-ds 0.10.0-experimental.3 */
import type { Snippet } from "svelte";
import type { ButtonProps } from "$lib/components";
import type { Shortcut } from "$lib/shortcut";

export type ActionButtonProps = Omit<
  ButtonProps,
  "children" | "iconLeft" | "iconRight"
> & {
  /**
   * The icon to show for the action
   */
  children: Snippet<[]>;

  /**
   * The label to show for the action
   */
  label?: string;

  /**
   * The shortcut to run for the action, this will be attached to the textarea keydown event.
   */
  shortcut?: Shortcut<HTMLTextAreaElement>;
};
