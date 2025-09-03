/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as HeaderRoot } from "./Header.svelte";
import { CloseButton } from "./common/index.js";

const Header = HeaderRoot as typeof HeaderRoot & {
  CloseButton: typeof CloseButton;
};

Header.CloseButton = CloseButton;

export { Header };
export * from "./types.js";
export type { CloseButtonProps } from "./common/index.js";
