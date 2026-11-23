import type {
  Checkbox,
  SearchBox,
  TextInput,
} from "@canonical/svelte-ds-app-launchpad";
import type { ComponentProps } from "svelte";
import type MoreFiltersMenu from "./MoreFiltersMenu.svelte";
import type PersonFilterCombobox from "./PersonFilterCombobox.svelte";
import type PocketFilterMenu from "./PocketFilterMenu.svelte";
import type SearchModeMenu from "./SearchModeMenu.svelte";
import type SeriesFilterMenu from "./SeriesFilterMenu.svelte";

export type PackageFilterControl =
  | { kind: "match"; props: ComponentProps<typeof SearchModeMenu> }
  | { kind: "search"; mode: "bar"; props: ComponentProps<typeof SearchBox> }
  | { kind: "search"; mode: "edit"; props: ComponentProps<typeof TextInput> }
  | {
      kind: "maintainer" | "signer";
      props: ComponentProps<typeof PersonFilterCombobox>;
    }
  | { kind: "series"; props: ComponentProps<typeof SeriesFilterMenu> }
  | { kind: "pocket"; props: ComponentProps<typeof PocketFilterMenu> }
  | { kind: "more"; props: ComponentProps<typeof MoreFiltersMenu> }
  | {
      kind: "ubuntuChange" | "allStatuses";
      props: ComponentProps<typeof Checkbox>;
    };
