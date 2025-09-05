<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Group } from "../../common/index.js";
  import { SingleSelectCombobox } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/SingleSelectCombobox/Group",
    tags: ["autodocs"],
    component: Group,
    args: {
      groupTitle: "Theme",
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <SingleSelectCombobox.Group {...args}>
      <SingleSelectCombobox.Item
        text="System"
        secondaryText="(recommended)"
        value="system"
        checked
      />
      <SingleSelectCombobox.Item text="Light" value="light" />
      <SingleSelectCombobox.Item text="Dark" value="dark" />
    </SingleSelectCombobox.Group>
  {/snippet}
</Story>
