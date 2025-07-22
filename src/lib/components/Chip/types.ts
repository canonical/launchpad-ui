/* @canonical/generator-ds 0.9.1-experimental.0 */
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { SemanticModifiers } from "../constants";

type BadgeOptions = {
  /** The value of the badge */
  value: string;
  /** The type of the badge.
   * @default `default`
   */
  type?: "default" | "error";
} & HTMLAttributes<HTMLSpanElement>;

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
  modifiers?: SemanticModifiers<["density", "severity"]>;

  /** The value of the chip */
  value: string;
  /** The key of the chip
   * @default no key
   */
  key?: string;
  /** The badge of the chip
   * @default no badge
   */
  badge?: BadgeOptions;
  // TODO: this will most likely change once we define SVG icons
  /** The icon of the Chip
   * @default no icon
   */
  icon?: Snippet | undefined | null;
  /** Whether the chip is readonly or clickable.
   * @default clickable (`false`)
   */
  isReadonly?: boolean;
} & ChipClickOptions;
