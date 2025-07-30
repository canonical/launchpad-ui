/* @canonical/generator-ds 0.9.1-experimental.0 */
import type { Snippet } from "svelte";
import type { SemanticModifiers } from "$lib/modifiers";
import { SEMANTIC_MODIFIERS } from "$lib/modifiers";

/** Either the chip can be clicked or the dismiss button can be clicked.
 * We cannot have both click and dismiss events at the same time.
 */
type ChipClickOptions =
  | {
      /** Callback function to handle click events on the chip */
      onClick?: (event: MouseEvent) => void;
    }
  | {
      /** Callback function to handle dismiss events on the chip */
      onDismiss?: (event: MouseEvent) => void;
    };

export type ChipProps = {
  /** A unique identifier for the Chip */
  id?: string | undefined | null;
  /** Additional CSS classes */
  class?: string | undefined | null;
  /** Inline styles */
  style?: string | undefined | null;

  /** Chip modifiers to apply for styling */
  modifiers?: SemanticModifiers<
    [
      (typeof SEMANTIC_MODIFIERS)["density"],
      (typeof SEMANTIC_MODIFIERS)["severity"],
    ]
  >;
  /** The value of the chip */
  value: string;
  /** The key of the chip
   * @default no key
   */
  key?: string;
  /** The icon of the Chip
   * @default no icon
   */
  icon?: Snippet | undefined | null;
  /** Whether the chip is readonly or clickable.
   * @default clickable (`false`)
   */
  isReadonly?: boolean;
} & ChipClickOptions;
