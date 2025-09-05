<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Group } from "../../common/index.js";
  import { MultiSelectCombobox } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/MultiSelectCombobox/Group",
    tags: ["autodocs"],
    component: Group,
    args: {
      groupTitle: "Theme",
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <MultiSelectCombobox.Group {...args}>
      <MultiSelectCombobox.Item
        text="System"
        secondaryText="(recommended)"
        value="system"
        checked
      />
      <MultiSelectCombobox.Item text="Light" value="light" />
      <MultiSelectCombobox.Item text="Dark" value="dark" />
    </MultiSelectCombobox.Group>
  {/snippet}
</Story>
