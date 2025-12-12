/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { JobRead } from "$lib/api/job-manager/types.js";

export interface JobStatusProps {
  status: NonNullable<JobRead["status"]>;
}
