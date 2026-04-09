/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { LinkProps as BaseLinkProps } from "@canonical/svelte-ds-app-launchpad";

export type LinkProps = Omit<BaseLinkProps, "soft">;
