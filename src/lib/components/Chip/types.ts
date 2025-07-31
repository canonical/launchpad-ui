/* @canonical/generator-ds 0.9.1-experimental.0 */
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { SemanticModifier } from "$lib/modifiers";
import { SEMANTIC_MODIFIERS } from "$lib/modifiers";

/** Either the chip can be clicked or the dismiss button can be clicked.
 * We cannot have both click and dismiss events at the same time.
 */
type ChipClickOptions =
  | {
      /** Callback function to handle click events on the chip */
      onclick?: (event: MouseEvent) => void;
    }
  | {
      /** Callback function to handle dismiss events on the chip */
      ondismiss?: (event: MouseEvent) => void;
    };

export type ChipProps = HTMLAttributes<HTMLElement> & {
  /** Chip modifiers to apply for styling */
  modifiers?: (
    | SemanticModifier<
        [
          (typeof SEMANTIC_MODIFIERS)["density"],
          (typeof SEMANTIC_MODIFIERS)["severity"],
        ]
      >
    | "readonly"
  )[];

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
} & ChipClickOptions;
