import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type {
  FilterRepresentationConfig,
  FilterTextPart,
} from "#lib/modules/filtering/representation.js";

export type FilterSummaryProps<TFilters extends object> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Configuration describing how each filter field is formatted into summary parts. */
  config: FilterRepresentationConfig<TFilters>;
  /** Current filter values to summarize. */
  filters: TFilters;
  /** Name of the table view, used to label the filter list and the edit view button. */
  tableViewName: string;
  /** Link target for the edit table view button; when omitted or empty, no button is rendered. */
  editTableViewHref?: string;
  /** Custom renderer for the list items, receiving the visible filter text parts. Defaults to a single `FilterSummary.Group`. */
  children?: Snippet<[parts: FilterTextPart<TFilters>[]]>;
};
