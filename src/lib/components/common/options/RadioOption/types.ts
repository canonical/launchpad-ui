/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { RadioProps } from "@canonical/svelte-ds-app-launchpad";
import type { HTMLInputAttributes } from "svelte/elements";
import type { OptionContentProps } from "../common/index.js";

export type RadioOptionProps<T = HTMLInputAttributes["value"]> = RadioProps<T> &
  OptionContentProps & {
    labelRef?: HTMLLabelElement;
  };
