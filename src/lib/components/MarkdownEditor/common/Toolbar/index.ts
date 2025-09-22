/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as ToolbarRoot } from "./Toolbar.svelte";
import { ActionButton, Group } from "./common/index.js";

const Toolbar = ToolbarRoot as typeof ToolbarRoot & {
  Toolbar: typeof ToolbarRoot;
  /**
   * `Toolbar.Group` groups related toolbar items together.
   *
   * @example
   * ```svelte
   * <MarkdownEditor>
   *  <MarkdownEditor.Toolbar>
   *    <MarkdownEditor.Toolbar.Group>
   *      <button>Bold</button>
   *      <button>Italic</button>
   *      <button>Heading</button>
   *    </MarkdownEditor.Toolbar.Group>
   *  </MarkdownEditor.Toolbar>
   * </MarkdownEditor>
   * ```
   */
  Group: typeof Group;
  /**
   * `Toolbar.ActionButton` is a button that can be used to add an action to the toolbar.
   *
   * @example
   * ```svelte
   * <MarkdownEditor>
   *  <MarkdownEditor.Toolbar>
   *   <MarkdownEditor.Toolbar.ActionButton>
   *     <Icon name="bold" />
   *   </MarkdownEditor.Toolbar.ActionButton>
   *  </MarkdownEditor.Toolbar>
   * </MarkdownEditor>
   * ```
   */
  ActionButton: typeof ActionButton;
};

Toolbar.Group = Group;
Toolbar.ActionButton = ActionButton;

export * from "./types.js";
export { Toolbar };
