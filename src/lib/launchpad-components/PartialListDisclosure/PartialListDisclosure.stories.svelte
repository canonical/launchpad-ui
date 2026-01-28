<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/index.js";
  import PartialListDisclosure from "./PartialListDisclosure.svelte";

  const { Story } = defineMeta({
    title: "Launchpad Components/PartialListDisclosure",
    tags: ["autodocs"],
    component: PartialListDisclosure,
    argTypes: {
      children: { control: false },
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <PartialListDisclosure {...args}>
      {#snippet children(
        listProps,
        hiddenItemProps,
        toggleButtonProps,
        isExpanded,
      )}
        <ul {...listProps}>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li {...hiddenItemProps}>Item 4</li>
          <li {...hiddenItemProps}>Item 5</li>
          <li {...hiddenItemProps}>Item 6</li>
          <li {...hiddenItemProps}>Item 7</li>
          <li {...hiddenItemProps}>Item 8</li>
          <li {...hiddenItemProps}>Item 9</li>
        </ul>
        <Button {...toggleButtonProps}>
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      {/snippet}
    </PartialListDisclosure>
  {/snippet}
</Story>
