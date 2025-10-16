<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Combobox } from "../../index.js";
  import Search from "./Search.svelte";
  import type { SearchProps } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/Combobox/Search",
    tags: ["autodocs"],
    component: Search,
    args: {
      "aria-label": "Search users",
    },
    render,
  });
</script>

{#snippet render(args: SearchProps)}
  <Combobox.Search {...args} />
{/snippet}

<Story name="Default" />

<Story
  name="With invalid styles"
  args={{
    styleInvalid: true,
    placeholder: "Type at least 3 characters",
    required: true,
    minlength: 3,
  }}
/>

<Story
  name="Disabled"
  args={{
    disabled: true,
    placeholder: "Search disabled",
  }}
/>
