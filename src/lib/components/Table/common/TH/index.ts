/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as THRoot } from "./TH.svelte";
import { SortButton, SortLink } from "./common/index.js";

const TH = THRoot as typeof THRoot & {
  SortButton: typeof SortButton;
  SortLink: typeof SortLink;
};

TH.SortButton = SortButton;
TH.SortLink = SortLink;

export { TH };
export * from "./types.js";
