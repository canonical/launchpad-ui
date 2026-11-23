import type { PopoverProps } from "@canonical/svelte-ds-app-launchpad";
import type { ComponentProps } from "svelte";
import type { AriaAttributes } from "svelte/elements";
import type { FilterChangeHandler } from "#lib/modules/filtering/types.js";
import type PersonFilterCombobox from "./PersonFilterCombobox.svelte";
import type { PackagesFilters } from "./schema.js";

type ValueFilterKey = {
  [K in keyof PackagesFilters]-?: PackagesFilters[K] extends boolean
    ? never
    : K;
}[keyof PackagesFilters];

type ToggleFilterKey = Exclude<keyof PackagesFilters, ValueFilterKey>;

export type PersonFilterKey = "maintainer" | "signer";

type FilterInputProps = {
  name: string;
  "aria-invalid"?: AriaAttributes["aria-invalid"];
};

/**
 * Binds the package filter controls to wherever the filters are edited, e.g. the URL or a table view form,
 * so the same controls can be rendered in each of those places.
 */
export interface PackageFilterInputs {
  value(key: ValueFilterKey): FilterInputProps & { value: string | undefined };
  toggle(key: ToggleFilterKey): FilterInputProps & { checked: boolean };
  personSearch(
    key: PersonFilterKey,
  ): Pick<
    ComponentProps<typeof PersonFilterCombobox>,
    "searchInputProps" | "searchButtonProps"
  >;
  /** Called when a control picks a value, e.g. to apply the filters right away. */
  onchange?: FilterChangeHandler<unknown>;
  position?: PopoverProps["position"];
}
