/* @canonical/generator-ds 0.9.0-experimental.22 */
import { type Snippet } from "svelte";

export type BoxProps = {
  /** A unique identifier for the Box */
  id?: string | undefined | null;
  /** Additional CSS classes */
  class?: string | undefined | null;
  /** Child elements */
  children?: Snippet | undefined | null;
  /** Inline styles */
  style?: string | undefined | null;
};
