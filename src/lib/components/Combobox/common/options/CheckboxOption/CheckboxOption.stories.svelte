<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import CheckboxOption from "./CheckboxOption.svelte";

  const { Story } = defineMeta({
    title: "Components/Combobox/CheckboxOption",
    tags: ["autodocs"],
    component: CheckboxOption,
  });
</script>

<Story name="Default" />
