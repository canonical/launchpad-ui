import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type {
  FilterRepresentationConfig,
  FilterTextPart,
} from "#lib/filter/index.js";

export type FilterSummaryProps<TFilters extends object> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  config: FilterRepresentationConfig<TFilters>;
  filters: TFilters;
  listLabel?: string;
  children?: Snippet<[parts: FilterTextPart<TFilters>[]]>;
  actions?: Snippet;
};
