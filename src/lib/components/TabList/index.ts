/* @canonical/generator-ds 0.9.0-experimental.22 */
import { default as TabListRoot } from "./TabList.svelte";
import { Tab } from "./common/index.js";

const TabList = TabListRoot as typeof TabListRoot & {
  Tab: typeof Tab;
};
TabList.Tab = Tab;

export * from "./types.js";
export * from "./common/Tab/types.js";
export { TabList };
