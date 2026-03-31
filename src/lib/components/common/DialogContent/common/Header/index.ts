/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as HeaderRoot } from "./Header.svelte";
import { CloseButton } from "./common/index.js";

const Header = HeaderRoot as typeof HeaderRoot & {
  /**
   * `DialogContent.Header.CloseButton` is a wrapper over `Button` meant to be used as a close button in dialog headers.
   *
   * @example
   * ```svelte
   * <DialogContent.Header.CloseButton onclick={handleClose} />
   * ```
   */
  CloseButton: typeof CloseButton;
};

Header.CloseButton = CloseButton;

export { Header };
export type { CloseButtonProps } from "./common/index.js";
export type { HeaderProps } from "./types.js";
