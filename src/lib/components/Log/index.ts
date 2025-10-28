/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as LogRoot } from "./Log.svelte";
import { Line } from "./common/index.js";

const Log = LogRoot as typeof LogRoot & {
  Line: typeof Line;
};

Log.Line = Line;

export { Log };

export type { LineProps as LogLineProps } from "./common/index.js";
export * from "./types.js";
