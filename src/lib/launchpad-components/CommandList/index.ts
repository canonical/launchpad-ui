/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as CommandListRoot } from "./CommandList.svelte";
import { Command } from "./common/index.js";

const CommandList = CommandListRoot as typeof CommandListRoot & {
  Command: typeof Command;
};

CommandList.Command = Command;

export { CommandList };
export * from "./types.js";
export type { CommandProps } from "./common/index.js";
