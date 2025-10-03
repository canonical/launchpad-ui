/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as MarkdownEditorRoot } from "./MarkdownEditor.svelte";
import { Header, Textarea, Toolbar } from "./common/index.js";

/**
 * `MarkdownEditor` simple and minimalistic markdown editor with a toolbar. This is based on `textarea` and uses JavaScript for interactions via the toolbar and shortcuts.
 *
 * @example
 * ```svelte
 * <MarkdownEditor>
 *  <MarkdownEditor.Toolbar />
 *  <MarkdownEditor.Textarea bind:value={value} />
 * </MarkdownEditor>
 * ```
 */
const MarkdownEditor = MarkdownEditorRoot as typeof MarkdownEditorRoot & {
  /**
   * `MarkdownEditor.Textarea` renders a textarea with markdown support.
   *
   * @example
   * ```svelte
   * <MarkdownEditor>
   *  <MarkdownEditor.Textarea rows={10} bind:value={value} style="resize: none;"/>
   * </MarkdownEditor>
   * ```
   */
  Textarea: typeof Textarea;

  /**
   * `MarkdownEditor.Header` is a header for the `MarkdownEditor` component, it consists of an actions area which can be a toolbar and controls.
   *
   * @example
   * ```svelte
   * <MarkdownEditor>
   *  <MarkdownEditor.Header>
   *    <MarkdownEditor.Toolbar>
   *      <MarkdownEditor.Toolbar.ActionButton>
   *        {#snippet iconLeft()}
   *          <Icon name="bold" />
   *        {/snippet}
   *      </MarkdownEditor.Toolbar.ActionButton>
   *    </MarkdownEditor.Toolbar>
   *    {#snippet controls()}
   *      <Button>Preview</Button>
   *    {/snippet}
   *  </MarkdownEditor.Header>
   * </MarkdownEditor>
   * ```
   */
  Header: typeof Header;

  /**
   * `Toolbar` is a toolbar for the `MarkdownEditor` component, it adds Markdown formatting options and the ability to include custom controls and additional actions.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/toolbar_role#horizontal_toolbar | MDN WAI ARIA guidelines for horizontal toolbars}
   *
   * @example
   * ```svelte
   * <MarkdownEditor>
   *  <MarkdownEditor.Header>
   *    <MarkdownEditor.Toolbar>
   *      <MarkdownEditor.Toolbar.ActionButton>
   *        {#snippet iconLeft()}
   *          <Icon name="bold" />
   *        {/snippet}
   *      </MarkdownEditor.Toolbar.ActionButton>
   *    </MarkdownEditor.Toolbar>
   *    <MarkdownEditor.Controls>
   *      <label>
   *        <Checkbox /> Preview
   *      </label>
   *    </MarkdownEditor.Controls>
   *  </MarkdownEditor.Header>
   * </MarkdownEditor>
   * ```
   */
  Toolbar: typeof Toolbar;
};

MarkdownEditor.Header = Header;
MarkdownEditor.Textarea = Textarea;
MarkdownEditor.Toolbar = Toolbar;

export type {
  ActionButtonProps as MarkdownEditorToolbarActionButtonProps,
  GroupProps as MarkdownEditorToolbarGroupProps,
  HeaderProps as MarkdownEditorHeaderProps,
  TextareaProps as MarkdownEditorTextareaProps,
  ToolbarProps as MarkdownEditorToolbarProps,
} from "./common/index.js";
export * from "./types.js";
export { MarkdownEditor };
