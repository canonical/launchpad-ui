/* @canonical/generator-ds 0.10.0-experimental.3 */
import type { Snippet } from "svelte";
import type { ButtonProps } from "$lib/components";
import type { Shortcut } from "$lib/shortcut";

export interface ActionButtonProps
  extends Omit<ButtonProps, "children" | "iconLeft" | "iconRight"> {
  /**
   * The icon to show for the action
   */
  children: Snippet<[]>;

  /**
   * The label to show for the action
   */
  label: string;

  /**
   * The shortcut to run for the action, this will be attached to the textarea keydown event.
   */
  shortcut?: Shortcut;

  /**
   * The action to run to perform when the action is clicked or triggered via shortcut.
   *
   * _Note:_ if `onclick` is provided, it will override this function for click based execution.
   *
   * @example
   * ```ts
   * callback: (textarea: HTMLTextAreaElement) => {
   *   document.execCommand("insertText", false, "# ");
   * }
   */
  callback?: (textarea: HTMLTextAreaElement) => void;
}
