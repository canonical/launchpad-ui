declare module "markdown-actions" {
  export function toggleBold(textarea: HTMLTextAreaElement): void;
  export function toggleItalic(textarea: HTMLTextAreaElement): void;
  export function toggleCode(textarea: HTMLTextAreaElement): void;
  /**
   *
   * @param textarea - The textarea element to insert the link into ()
   * @param options
   * @param options.text - Overrides the default selected text if specified.
   * @param options.url - The URL to insert into the link, can be empty to use the selected URL.
   *
   */
  export function insertLink(
    textarea,
    options?: { text: string; url: string },
  ): void;
  export function toggleBulletList(textarea: HTMLTextAreaElement): void;
  export function toggleNumberedList(textarea: HTMLTextAreaElement): void;
  export function toggleQuote(textarea: HTMLTextAreaElement): void;
  export function toggleTaskList(textarea: HTMLTextAreaElement): void;
  /**
   * Inserts a header into the textarea.
   * @param textarea - The textarea element to insert the header into.
   * @param level - The level of the header to insert (default: 1)
   * @param toggle - Whether to toggle the header (default: false)
   */
  export function insertHeader(
    textarea: HTMLTextAreaElement,
    level?: number,
    toggle?: boolean,
  ): void;
  export function toggleH1(textarea: HTMLTextAreaElement): void;
  export function toggleH2(textarea: HTMLTextAreaElement): void;
  export function toggleH3(textarea: HTMLTextAreaElement): void;
  export function getActiveFormats(textarea: HTMLTextAreaElement): void;
  export function hasFormat(
    textarea: HTMLTextAreaElement,
    format: string,
  ): void;
  export function expandSelection(
    textarea: HTMLTextAreaElement,
    options?: {
      toWord?: boolean;
      toLine?: boolean;
    },
  ): void;
}
