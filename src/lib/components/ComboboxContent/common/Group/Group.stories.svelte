<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ComboboxContent } from "../../index.js";
  import Group from "./Group.svelte";

  const { Story } = defineMeta({
    title: "Components/ComboboxContent/Group",
    tags: ["autodocs"],
    component: Group,
    args: {
      groupTitle: "Theme",
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <ComboboxContent.Group {...args}>
      <ComboboxContent.Item
        text="System"
        secondaryText="(recommended)"
        name="theme"
        value="system"
        checked
      />
      <ComboboxContent.Item text="Light" name="theme" value="light" />
      <ComboboxContent.Item text="Dark" name="theme" value="dark" />
    </ComboboxContent.Group>
  {/snippet}
</Story>
