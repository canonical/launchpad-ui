/* @canonical/generator-ds 0.10.0-experimental.2 */

import { default as EventRoot } from "./Event.svelte";
import { TitleRow } from "./common/index.js";

const Event = EventRoot as typeof EventRoot & {
  TitleRow: typeof TitleRow;
};

Event.TitleRow = TitleRow;

export { Event };
export * from "./types.js";
export type { TitleRowProps } from "./common/index.js";
