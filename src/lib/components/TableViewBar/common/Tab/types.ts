import type { TableViewBarItemProps } from "../../types.js";

export interface TabProps extends TableViewBarItemProps {
  offsetWidth?: number | null;
  insetInlineEnd?: number;
  scrollMarginInlineStart?: number;
  scrollMarginInlineEnd?: number;
}
