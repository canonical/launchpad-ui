<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Search } from "../../common/index.js";

  const { Story } = defineMeta({
    title: "Components/SingleSelectCombobox/Search",
    tags: ["autodocs"],
    component: Search,
    args: {
      label: "Search",
    },
  });
</script>

<Story name="Default">Search</Story>

<Story
  name="With Props"
  args={{
    class: "custom-class",
    id: "unique-id",
    style: "background-color: tomato; padding: 10px; color: white;",
  }}
>
  Search with props
</Story>
