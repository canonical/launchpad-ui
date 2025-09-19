/* @canonical/generator-ds 0.10.0-experimental.3 */

import { default as ToolbarRoot } from "./Toolbar.svelte";
import { Group, Separator } from "./common/index.js";

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
   * `Toolbar.Separator` an inline separator for the `MarkdownEditor.Toolbar` component to be used between `MarkdownEditor.Toolbar.Group` components.
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
   *    <MarkdownEditor.Toolbar.Separator />
   *    <MarkdownEditor.Toolbar.Group>
   *    ...
   *    </MarkdownEditor.Toolbar.Group>
   *  </MarkdownEditor.Toolbar>
   * </MarkdownEditor>
   * ```
   */
  Separator: typeof Separator;
};

Toolbar.Toolbar = ToolbarRoot;
Toolbar.Group = Group;
Toolbar.Separator = Separator;

export { Toolbar };
export * from "./types.js";
