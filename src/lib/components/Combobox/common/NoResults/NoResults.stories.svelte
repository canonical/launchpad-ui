<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { NoResults } from "../../common/index.js";
  import { Combobox } from "../../index.js";

  const { Story } = defineMeta({
    title: "Components/Combobox/NoResults",
    tags: ["autodocs"],
    component: NoResults,
  });
</script>

<Story name="Default" asChild>
  <Combobox.NoResults />
</Story>

<Story name="With custom text" asChild>
  <Combobox.NoResults>Custom no results message</Combobox.NoResults>
</Story>
