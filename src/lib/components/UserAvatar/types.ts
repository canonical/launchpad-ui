/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { HTMLAttributes } from "svelte/elements";
import type {
  SEMANTIC_MODIFIERS,
  SemanticModifier,
} from "$lib/modifiers/index.js";
import type { WithoutChildren } from "$lib/type-utils";

export type UserAvatarProps = WithoutChildren<HTMLAttributes<HTMLElement>> & {
  modifiers?: SemanticModifier<[(typeof SEMANTIC_MODIFIERS)["SIZE"]]>[];
  /** The user's name */
  userName?: string;
  /** The URL of the user's avatar image */
  userAvatarUrl?: string;
};
