<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { NoResults } from "../../common/index.js";
  import { MultiSelectCombobox } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/MultiSelectCombobox/NoResults",
    tags: ["autodocs"],
    component: NoResults,
  });
</script>

<Story name="Default" asChild>
  <MultiSelectCombobox.NoResults />
</Story>

<Story name="With custom text" asChild>
  <MultiSelectCombobox.NoResults>
    Custom no results message
  </MultiSelectCombobox.NoResults>
</Story>
