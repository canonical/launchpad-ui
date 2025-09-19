/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as MarkdownEditorRoot } from "./MarkdownEditor.svelte";
import { Textarea, Toolbar } from "./common/index.js";

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
   * `Toolbar` is a toolbar for the `MarkdownEditor` component, it adds Markdown formatting options and the ability to include custom controls and additional actions.
   *
   * @docs
   * WAI ARIA guidelines for horizontal toolbars:
   * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/toolbar_role#horizontal_toolbar
   * 
   * @example
   ```svelte
     <MarkdownEditor>
       <MarkdownEditor.Toolbar>
           {#snippet actions()}
           <Button modifiers={{ density: "dense", severity: "base" }}>
               <Icon name="bold" />
           </Button>
           {/snippet}
           <label>
              <Checkbox /> Preview
           </label>
       </MarkdownEditor.Toolbar>
     </MarkdownEditor>
    ```
   */
  Toolbar: typeof Toolbar;
};
MarkdownEditor.Textarea = Textarea;
MarkdownEditor.Toolbar = Toolbar;

export * from "./types.js";
export { MarkdownEditor };
