/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { SelectProps } from "@canonical/svelte-ds-app-launchpad";

export type ItemsPerPageSelectProps = Omit<
  SelectProps,
  "multiple" | "ref" | "severity" | "density"
>;
