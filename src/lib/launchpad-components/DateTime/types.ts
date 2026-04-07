/* @canonical/generator-ds 0.10.0-experimental.5 */
import type { DateTimeProps as DateTimePropsBase } from "@canonical/svelte-ds-app-launchpad";

export type DateTimeProps = Omit<DateTimePropsBase, "formatter">;
