/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { SwitchProps } from "@canonical/svelte-ds-app-launchpad";
import type { HTMLInputAttributes } from "svelte/elements";
import type { OptionContentProps } from "../common/index.js";

export type SwitchOptionProps<T = HTMLInputAttributes["value"]> =
  SwitchProps<T> & OptionContentProps;
