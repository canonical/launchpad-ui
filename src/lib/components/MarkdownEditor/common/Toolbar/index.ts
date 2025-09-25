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
   *      <MarkdownEditor.Toolbar.ActionButton>
   *        {#snippet iconLeft()}
   *          <Icon name="bold" />
   *        {/snippet}
   *      </MarkdownEditor.Toolbar.ActionButton>
   *      <MarkdownEditor.Toolbar.ActionButton>
   *        {#snippet iconLeft()}
   *          <Icon name="italic" />
   *        {/snippet}
   *      </MarkdownEditor.Toolbar.ActionButton>
   *      <MarkdownEditor.Toolbar.ActionButton>
   *        {#snippet iconLeft()}
   *          <Icon name="heading" />
   *        {/snippet}
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
   *   <MarkdownEditor.Toolbar.ActionButton>
   *     {#snippet iconLeft()}
   *       <Icon name="bold" />
   *     {/snippet}
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
