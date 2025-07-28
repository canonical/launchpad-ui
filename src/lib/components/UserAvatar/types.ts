/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";

export type UserAvatarProps = HTMLAttributes<HTMLElement> & {
  /** The size of the avatar */
  size?: "small" | "medium" | "large";
  /** The user represented by the avatar */
  user?: {
    imageUrl?: string;
    name?: string;
  };
};
