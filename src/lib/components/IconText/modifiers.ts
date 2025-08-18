import { SEMANTIC_MODIFIERS, modifiers } from "$lib/modifiers";
import { LAUNCHPAD_MODIFIERS } from "$lib/modifiers-app";

export const iconTextModifiers = modifiers(
  SEMANTIC_MODIFIERS.SIZE,
  LAUNCHPAD_MODIFIERS.MERGE_PROPOSAL_REVIEW,
  LAUNCHPAD_MODIFIERS.MERGE_PROPOSAL_JOB_STATUS,
);

export type IconTextModifiers = typeof iconTextModifiers;
