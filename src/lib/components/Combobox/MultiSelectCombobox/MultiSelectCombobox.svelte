<script lang="ts">
  import { ComboboxRoot } from "../common/index.js";
  import type { ComboboxMethods } from "../common/index.js";
  import type { MultiSelectComboboxProps } from "./types.js";

  const props: MultiSelectComboboxProps = $props();

  let comboboxMethods = $state<ComboboxMethods>();

  export const showCombobox: ComboboxMethods["showCombobox"] = () => {
    comboboxMethods?.showCombobox();
  };
  export const hideCombobox: ComboboxMethods["hideCombobox"] = () => {
    comboboxMethods?.hideCombobox();
  };
  export const toggleCombobox: ComboboxMethods["toggleCombobox"] = () => {
    comboboxMethods?.toggleCombobox();
  };
</script>

<ComboboxRoot bind:this={comboboxMethods} type="multi" {...props} />
