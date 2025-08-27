/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";
import type { ModifiedBy, WithoutChildren } from "$lib/type-utils";
import type { UserAvatarModifiers } from "./modifiers";

export type UserOptions = {
  /** The user's name */
  userName?: string;
  /** The URL of the user's avatar image */
  userAvatarUrl?: string;
};

export interface UserAvatarProps
  extends WithoutChildren<HTMLAttributes<HTMLElement>>,
    ModifiedBy<UserAvatarModifiers>,
    UserOptions {}
