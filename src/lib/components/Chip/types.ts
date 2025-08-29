/* @canonical/generator-ds 0.9.1-experimental.0 */
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers";
import type { ChipModifiers } from "./modifiers";

/** Either the chip can be clicked or the dismiss button can be clicked.
 * We cannot have both click and dismiss events at the same time.
 */
type ChipClickOptions = {
  /** Callback function to handle click events on the chip */
  onclick?: (event: MouseEvent) => void;
  /** Callback function to handle dismiss events on the chip */
  ondismiss?: (event: MouseEvent) => void;
};

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLElement>, "onclick" | "children">,
    ModifiedBy<ChipModifiers>,
    ChipClickOptions {
  /** The value of the chip */
  value: string;

  /** The key of the chip
   * @default no value
   */
  lead?: string;

  /** The icon of the Chip
   * @default no icon
   */
  icon?: Snippet | undefined | null;

  /** The badge to be displayed on the Chip */
  badge?: Snippet | undefined | null;
}
