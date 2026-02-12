/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as THRoot } from "./TH.svelte";
import { SortButton } from "./common/index.js";

const TH = THRoot as typeof THRoot & {
  /**
   * A button that toggles the sort direction of the column.
   */
  SortButton: typeof SortButton;
};

TH.SortButton = SortButton;

export { TH };
export * from "./types.js";
