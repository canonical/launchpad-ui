/* @canonical/generator-ds 0.9.0-experimental.22 */
import { default as TabsRoot } from "./Tabs.svelte";
import { Tab } from "./common/Tab";

const Tabs = TabsRoot as typeof TabsRoot & {
  Tab: typeof Tab;
};
Tabs.Tab = Tab;

export * from "./types.js";
export * from "./common/Tab/types.js";
export { Tabs };
