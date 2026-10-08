import type { ModifierFamily } from "@canonical/svelte-ds-app-launchpad";
import type { SvelteHTMLElements } from "svelte/elements";

export type MeterProps = SvelteHTMLElements["meter"] &
  ModifierFamily<"criticality">;
