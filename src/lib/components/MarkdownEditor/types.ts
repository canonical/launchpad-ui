/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";

export type EditorMode = "preview" | "edit";

export interface MarkdownEditorContext {
  /** The textarea element, containing the markdown content. */
  get textareaElement(): HTMLTextAreaElement | undefined;
  set textareaElement(value: HTMLTextAreaElement | undefined);
}

type BaseProps = SvelteHTMLElements["div"];

export interface MarkdownEditorProps extends BaseProps {
  /**
   * The default editor mode to use when the component is first rendered.
   *
   * @default "edit"
   */
  defaultEditorMode?: EditorMode;

  /**
   * Whether the preview mode is disabled.
   *
   * @default false
   */
  previewDisabled?: boolean;
}
