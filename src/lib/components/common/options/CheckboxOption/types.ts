/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { CheckboxProps } from "@canonical/svelte-ds-app-launchpad";
import type { HTMLInputAttributes } from "svelte/elements";
import type { OptionContentProps } from "../common/index.js";

export type CheckboxOptionProps<T = HTMLInputAttributes["value"]> =
  CheckboxProps<T> &
    OptionContentProps & {
      labelRef?: HTMLLabelElement;
    };
