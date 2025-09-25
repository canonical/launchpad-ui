import { untrack } from "svelte";
import type { ChainingManager } from "./ChainingManager.js";

export function useDelayedOpen(
  getOpen: () => boolean,
  getDelay: () => number,
  chainingManager: ChainingManager,
) {
  let delayedOpen = $state(false);

  $effect(() => {
    if (getOpen()) {
      if (chainingManager.chaining) {
        // If chaining, open immediately without delay
        delayedOpen = true;
        return;
      }

      const delayTimeout = setTimeout(() => {
        delayedOpen = true;
        // Do not rerun if delay changes, apply the new delay only to the next open change
      }, untrack(getDelay));

      return () => clearTimeout(delayTimeout);
    }

    delayedOpen = false;
  });

  let firstRun = true;
  $effect(() => {
    // Each time the tooltip closes, enable chaining for a short period
    // Skip first run. Be sure to read `delayedOpen` first to ensure the effect runs again when it changes
    if (!delayedOpen && !firstRun) {
      chainingManager.chaining = true;
    }
    firstRun = false;
  });

  return () => delayedOpen;
}
