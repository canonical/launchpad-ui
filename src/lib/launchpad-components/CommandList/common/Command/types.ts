/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { JobStatus } from "$lib/api/job-manager/types.js";

export interface CommandProps {
  status: JobStatus | null;
  command: string;
  href?: string;
}
