import type { PopoverProps } from "@canonical/svelte-ds-app-launchpad";
import type { AriaAttributes } from "svelte/elements";

/** Called when a filter control picks a new value. */
export type FilterChangeHandler<T> = (
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
  value: T,
) => void;

/** Props of a single-choice filter control, matching a remote form's `field.as("select")`. */
export type ChoiceFilterProps<T> = {
  /** ID of the form the choice is submitted with. */
  form: string;
  /** Form field name for the choice. */
  name: string;
  /** The chosen value; empty or nullish means "All". */
  value: string | null | undefined;
  onchange?: FilterChangeHandler<T>;
  /** ID(s) of the elements labelling the popover trigger. */
  "aria-labelledby": string;
  position?: PopoverProps["position"];
  /** Unused, as the trigger is a button, which can't be invalid; accepted so `field.as("select")` can be spread. */
  "aria-invalid"?: AriaAttributes["aria-invalid"];
};
