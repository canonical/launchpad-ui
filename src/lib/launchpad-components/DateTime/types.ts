/* @canonical/generator-ds 0.10.0-experimental.5 */
import type { DateTimeProps as DateTimePropsBase } from "$lib/components/index.js";

export type DateTimeProps = Omit<DateTimePropsBase, "formatter">;
