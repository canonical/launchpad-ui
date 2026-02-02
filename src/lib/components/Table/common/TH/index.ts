/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as THRoot } from "./TH.svelte";
import { SortButton, SortLink } from "./common/index.js";

const TH = THRoot as typeof THRoot & {
  /**
   * A button that toggles the sort direction of the column.
   */
  SortButton: typeof SortButton;
  /**
   * A link that toggles the sort direction of the column.
   */
  SortLink: typeof SortLink;
};

TH.SortButton = SortButton;
TH.SortLink = SortLink;

export { TH };
export * from "./types.js";
