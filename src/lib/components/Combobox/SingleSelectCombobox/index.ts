import { Footer, Group, Helper, NoResults, Search } from "../common/index.js";
import { default as MultiSelectComboboxRoot } from "./SingleSelectCombobox.svelte";
import { Item } from "./common/index.js";

const SingleSelectCombobox =
  MultiSelectComboboxRoot as typeof MultiSelectComboboxRoot & {
    Footer: typeof Footer;
    Group: typeof Group;
    Helper: typeof Helper;
    Item: typeof Item;
    NoResults: typeof NoResults;
    Search: typeof Search;
  };

SingleSelectCombobox.Footer = Footer;
SingleSelectCombobox.Group = Group;
SingleSelectCombobox.Helper = Helper;
SingleSelectCombobox.Item = Item;
SingleSelectCombobox.NoResults = NoResults;
SingleSelectCombobox.Search = Search;

export { SingleSelectCombobox };
export * from "./types.js";

export type {
  ComboboxMethods as MultiSelectComboboxMethods,
  FooterProps as MultiSelectComboboxFooterProps,
  GroupProps as MultiSelectComboboxGroupProps,
  HelperProps as MultiSelectComboboxHelperProps,
  NoResultsProps as MultiSelectComboboxNoResultsProps,
  SearchProps as MultiSelectComboboxSearchProps,
} from "../common/index.js";

export type { ItemProps as SingleSelectComboboxItemProps } from "./common/index.js";
