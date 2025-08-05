/* @canonical/generator-ds 0.9.1-experimental.0 */

import type { UserAvatarProps } from "$lib/components/UserAvatar/index.js";

export interface UserChipProps extends UserAvatarProps {
  /** The user's name */
  userName: string;
  /** Whether to show the avatar or not */
  showAvatar?: boolean;
}
