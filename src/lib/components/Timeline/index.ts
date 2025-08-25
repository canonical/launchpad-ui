/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as TimelineRoot } from "./Timeline.svelte";
import { Event, IconMarker, TitleRow } from "./common/index.js";

const Timeline = TimelineRoot as typeof TimelineRoot & {
  Event: typeof Event;
  IconMarker: typeof IconMarker;
  TitleRow: typeof TitleRow;
};

Timeline.Event = Event;
Timeline.IconMarker = IconMarker;
Timeline.TitleRow = TitleRow;

export { Timeline };
export * from "./types.js";
export type {
  EventProps,
  IconMarkerProps,
  TitleRowProps,
} from "./common/index.js";
