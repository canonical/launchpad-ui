/* @canonical/generator-ds 0.10.0-experimental.5 */

export interface PartialTextDisclosureProps {
  /** The text to display, visually collapsed to `maxLines` when it overflows. */
  text: string;
  /**
   * The maximum number of lines to show when collapsed.
   * @default 5
   */
  maxLines?: number;
  /**
   * The line height in pixels, used for accurate overflow detection when it cannot be determined automatically.
   */
  lineHeightPx?: number;
}
