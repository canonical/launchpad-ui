/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as ToolbarRoot } from "./Toolbar.svelte";
import { ActionButton, Group } from "./common/index.js";
const Toolbar = ToolbarRoot as typeof ToolbarRoot & {
  /**
   * `Toolbar.Group` groups related toolbar items together.
   *
   * @example
   * ```svelte
   * <MarkdownEditor>
   *  <MarkdownEditor.Toolbar>
   *    <MarkdownEditor.Toolbar.Group>
   *      <MarkdownEditor.Toolbar.ActionButton label="Bold">
   *        <Bold />
   *      </MarkdownEditor.Toolbar.ActionButton>
   *      <MarkdownEditor.Toolbar.ActionButton label="Italic">
   *        <Italic />
   *      </MarkdownEditor.Toolbar.ActionButton>
   *      <MarkdownEditor.Toolbar.ActionButton label="Heading">
   *        <Heading />
   *      </MarkdownEditor.Toolbar.ActionButton>
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
   *   <MarkdownEditor.Toolbar.ActionButton label="Bold">
   *     <Bold />
   *   </MarkdownEditor.Toolbar.ActionButton>
   *  </MarkdownEditor.Toolbar>
   * </MarkdownEditor>
   * ```
   */
  ActionButton: typeof ActionButton;
};

Toolbar.Group = Group;
Toolbar.ActionButton = ActionButton;

export type * from "./common/index.js";
export * from "./types.js";
export { Toolbar };
