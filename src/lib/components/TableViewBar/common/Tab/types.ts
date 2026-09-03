import type { TableViewBarItemProps } from "../../types.js";

export interface TabProps extends Omit<TableViewBarItemProps, "key"> {
  current?: boolean;
  offsetWidth?: number | null;
  insetInlineEnd?: number;
  scrollMarginInlineStart?: number;
  scrollMarginInlineEnd?: number;
}
