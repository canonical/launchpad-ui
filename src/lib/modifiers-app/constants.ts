import type { Modifiers } from "$lib/modifiers";

export const LAUNCHPAD_MODIFIERS = {
  // TODO: incomplete list of mods, need to look into forgejo API docs
  MERGE_PROPOSAL_REVIEW: ["pending", "approve", "needs-fixing", "disapprove"],
  MERGE_PROPOSAL_JOB_STATUS: ["job-success", "job-failed", "job-skipped"],
} as const satisfies Modifiers;
