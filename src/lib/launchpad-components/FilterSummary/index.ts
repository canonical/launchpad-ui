import { default as FilterSummaryRoot } from "./FilterSummary.svelte";
import { Group } from "./common/index.js";

const FilterSummary = FilterSummaryRoot as typeof FilterSummaryRoot & {
  Group: typeof Group;
};
FilterSummary.Group = Group;

export { FilterSummary };
export type { GroupProps as FilterSummaryGroupProps } from "./common/index.js";
export * from "./types.js";
