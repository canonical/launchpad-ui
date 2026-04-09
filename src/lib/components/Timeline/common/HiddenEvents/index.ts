/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as HiddenEventsRoot } from "./HiddenEvents.svelte";
import { Link } from "./common/index.js";

const HiddenEvents = HiddenEventsRoot as typeof HiddenEventsRoot & {
  Link: typeof Link;
};

HiddenEvents.Link = Link;

export { HiddenEvents };
export * from "./types.js";
export type { LinkProps as HiddenEventsLinkProps } from "./common/index.js";
