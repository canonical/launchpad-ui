import type { HTMLAttributes } from "svelte/elements";
import type { FilterRepresentationConfig } from "../representation.js";

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
  /**
   * Filter keys to group visually, separated by dividers.
   * Keys not listed in any group are appended as a trailing group in `config` order.
   */
  groups?: (keyof TFilters)[][];
};
