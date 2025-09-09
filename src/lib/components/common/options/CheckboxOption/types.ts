/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { CheckboxProps } from "$lib/components/index.js";
import type { OptionContentProps } from "../common/index.js";

export type CheckboxOptionProps<T = HTMLInputAttributes["value"]> =
  CheckboxProps<T> & OptionContentProps;
