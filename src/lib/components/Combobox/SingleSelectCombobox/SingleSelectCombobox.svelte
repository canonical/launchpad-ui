<script lang="ts">
  import { ComboboxRoot } from "../common/index.js";
  import type { ComboboxMethods } from "../common/index.js";
  import { setSingleSelectComboboxContext } from "./context.js";
  import type { SingleSelectComboboxProps } from "./types.js";

  const { inputsName, ...props }: SingleSelectComboboxProps = $props();

  let selectedItemId = $state<string | null>(null);

  setSingleSelectComboboxContext({
    get inputsName() {
      return inputsName;
    },
    get selectedItemId() {
      return selectedItemId;
    },
    set selectedItemId(id: string | null) {
      selectedItemId = id;
    },
  });

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

<ComboboxRoot bind:this={comboboxMethods} type="single" {...props} />
