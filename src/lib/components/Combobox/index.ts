import { default as ComboboxRoot } from "./Combobox.svelte";
import {
  CheckboxOption,
  Footer,
  Group,
  Helper,
  Loading,
  NoResults,
  RadioOption,
  Search,
} from "./common/index.js";

const Combobox = ComboboxRoot as typeof ComboboxRoot & {
  Footer: typeof Footer;
  Group: typeof Group;
  Helper: typeof Helper;
  NoResults: typeof NoResults;
  Search: typeof Search;
  CheckboxOption: typeof CheckboxOption;
  RadioOption: typeof RadioOption;
  Loading: typeof Loading;
};

Combobox.Footer = Footer;
Combobox.Group = Group;
Combobox.Helper = Helper;
Combobox.NoResults = NoResults;
Combobox.Search = Search;
Combobox.CheckboxOption = CheckboxOption;
Combobox.RadioOption = RadioOption;
Combobox.Loading = Loading;

export { Combobox };
export type { ComboboxProps } from "./types.js";

export type {
  CheckboxOptionProps as ComboboxCheckboxOptionProps,
  FooterProps as ComboboxFooterProps,
  GroupProps as ComboboxGroupProps,
  HelperProps as ComboboxHelperProps,
  LoadingProps as ComboboxLoadingProps,
  NoResultsProps as ComboboxNoResultsProps,
  RadioOptionProps as ComboboxRadioOptionProps,
  SearchProps as ComboboxSearchProps,
} from "./common/index.js";
