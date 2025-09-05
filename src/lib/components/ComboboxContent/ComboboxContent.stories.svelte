<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
  import { ComboboxContent } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/ComboboxContent",
    tags: ["autodocs"],
    component: ComboboxContent,
    argTypes: {
      helper: {
        control: false,
      },
      footer: {
        control: false,
      },
    },
  });
</script>

<Story name="Default" asChild>
  <ComboboxContent>
    <ComboboxContent.Group groupTitle="Most Recent"></ComboboxContent.Group>
    <ComboboxContent.Group groupTitle="Contributors"></ComboboxContent.Group>
    {#snippet helper(id)}
      <ComboboxContent.Helper {id}>
        {#snippet icon()}
          <Icon name="information" />
        {/snippet}
        Helper Text
      </ComboboxContent.Helper>
    {/snippet}
    {#snippet footer()}
      <ComboboxContent.Footer>
        <Button modifiers={{ severity: "base", density: "dense" }}>
          Cancel
        </Button>
        <Button modifiers={{ density: "dense" }}>Save</Button>
      </ComboboxContent.Footer>
    {/snippet}
  </ComboboxContent>
</Story>

<Story name="Empty" asChild>
  <ComboboxContent>
    <ComboboxContent.NoResults />
    {#snippet helper(id)}
      <ComboboxContent.Helper {id}>
        {#snippet icon()}
          <Icon name="information" />
        {/snippet}
        Helper Text
      </ComboboxContent.Helper>
    {/snippet}
  </ComboboxContent>
</Story>
