/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { JobStatusIconProps } from "$lib/launchpad-components/JobStatusIcon/index.js";

export interface CommandProps {
  status: JobStatusIconProps["status"];
  command: string;
  href?: string;
}
