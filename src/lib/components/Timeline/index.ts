/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as TimelineRoot } from "./Timeline.svelte";
import { Event, HiddenEvents } from "./common/index.js";

const Timeline = TimelineRoot as typeof TimelineRoot & {
  Event: typeof Event;
  HiddenEvents: typeof HiddenEvents;
};

Timeline.Event = Event;
Timeline.HiddenEvents = HiddenEvents;

export { Timeline };
export * from "./types.js";
export type {
  EventProps,
  HiddenEventsProps,
  TitleRowProps,
} from "./common/index.js";
