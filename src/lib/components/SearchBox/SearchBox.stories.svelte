<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import SearchBox from "./SearchBox.svelte";

  const { Story } = defineMeta({
    title: "Components/SearchBox",
    tags: ["autodocs"],
    component: SearchBox,
    argTypes: {
      onclick: { control: false },
    },
    args: {
      "aria-label": "Search articles",
    },
  });
</script>

<Story name="Default" />

<Story
  name="As a search landmark"
  args={{
    "aria-label": "Articles",
    placeholder: "Ubuntu",
    required: true,
    name: "q",
  }}
>
  {#snippet template(args)}
    <search>
      <form action="/" id="search-form">
        <SearchBox {...args} />
      </form>
    </search>
  {/snippet}
</Story>

<input
  form="search-form"
  type="hidden"
  name="path"
  value="/story/components-searchbox--as-a-search-landmark"
/>

<input
  form="search-form"
  type="hidden"
  name="args"
  value="placeholder:You+have+found+an+Easter+egg"
/>

<Story
  name="With invalid styles"
  args={{
    invalidStyled: true,
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
