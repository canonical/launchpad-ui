import { Footer, Group, Helper, NoResults, Search } from "../common/index.js";
import { default as MultiSelectComboboxRoot } from "./MultiSelectCombobox.svelte";
import { Item } from "./common/index.js";

const MultiSelectCombobox =
  MultiSelectComboboxRoot as typeof MultiSelectComboboxRoot & {
    Footer: typeof Footer;
    Group: typeof Group;
    Helper: typeof Helper;
    Item: typeof Item;
    NoResults: typeof NoResults;
    Search: typeof Search;
  };

MultiSelectCombobox.Footer = Footer;
MultiSelectCombobox.Group = Group;
MultiSelectCombobox.Helper = Helper;
MultiSelectCombobox.Item = Item;
MultiSelectCombobox.NoResults = NoResults;
MultiSelectCombobox.Search = Search;

export { MultiSelectCombobox };
export * from "./types.js";

export type {
  ComboboxMethods as MultiSelectComboboxMethods,
  FooterProps as MultiSelectComboboxFooterProps,
  GroupProps as MultiSelectComboboxGroupProps,
  HelperProps as MultiSelectComboboxHelperProps,
  NoResultsProps as MultiSelectComboboxNoResultsProps,
  SearchProps as MultiSelectComboboxSearchProps,
} from "../common/index.js";

export type { ItemProps as MultiSelectComboboxItemProps } from "./common/index.js";
