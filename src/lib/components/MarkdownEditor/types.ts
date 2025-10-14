/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";

export interface MarkdownEditorContext {
  /** The textarea element, containing the markdown content. */
  textareaElement: HTMLTextAreaElement | undefined;

  /** The id of the textarea element. */
  textareaId: string | undefined;
}

type BaseProps = SvelteHTMLElements["div"];

export type MarkdownEditorProps = BaseProps;
