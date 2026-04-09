/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as HiddenEventsRoot } from "./HiddenEvents.svelte";
import { Link } from "./common/index.js";

const HiddenEvents = HiddenEventsRoot as typeof HiddenEventsRoot & {
  /**
   * `Timeline.HiddenEvents.Link` wraps the `Link` for use inside `Timeline.HiddenEvents`.
   * @example
   * ```svelte
   * <Timeline.HiddenEvents numHidden={3}>
   *   <Timeline.HiddenEvents.Link href="?showAll">Show all</Timeline.HiddenEvents.Link>
   * </Timeline.HiddenEvents>
   * ```
   */
  Link: typeof Link;
};

HiddenEvents.Link = Link;

export { HiddenEvents };
export * from "./types.js";
export type { LinkProps as HiddenEventsLinkProps } from "./common/index.js";
