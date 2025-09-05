<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ComboboxContent } from "../../index.js";
  import NoResults from "./NoResults.svelte";

  const { Story } = defineMeta({
    title: "Components/ComboboxContent/NoResults",
    tags: ["autodocs"],
    component: NoResults,
  });
</script>

<Story name="Default" asChild>
  <ComboboxContent.NoResults />
</Story>

<Story name="With custom text" asChild>
  <ComboboxContent.NoResults>
    Custom no results message
  </ComboboxContent.NoResults>
</Story>
