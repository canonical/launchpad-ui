<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { NoResults } from "../../common/index.js";
  import { SingleSelectCombobox } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/SingleSelectCombobox/NoResults",
    tags: ["autodocs"],
    component: NoResults,
  });
</script>

<Story name="Default" asChild>
  <SingleSelectCombobox.NoResults />
</Story>

<Story name="With custom text" asChild>
  <SingleSelectCombobox.NoResults>
    Custom no results message
  </SingleSelectCombobox.NoResults>
</Story>
