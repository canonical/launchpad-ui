/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { IconProps } from "@canonical/svelte-icons";
import type { JobStatus } from "$lib/api/job-manager/types.js";

export interface JobStatusIconProps extends IconProps {
  status: JobStatus | null;
}
