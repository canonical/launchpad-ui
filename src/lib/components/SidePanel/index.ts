/* @canonical/generator-ds 0.10.0-experimental.2 */

import { DialogContent } from "../common/index.js";
import { default as SidePanelRoot } from "./SidePanel.svelte";

const SidePanel = SidePanelRoot as typeof SidePanelRoot & {
  Content: typeof DialogContent;
};

SidePanel.Content = DialogContent;

export { SidePanel };
export * from "./types.js";
