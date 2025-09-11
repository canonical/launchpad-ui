<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Group } from "../../common/index.js";
  import { Combobox } from "../../index.js";

  const { Story } = defineMeta({
    title: "Components/Combobox/Group",
    tags: ["autodocs"],
    component: Group,
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <Combobox.Group {...args}>
      <Combobox.CheckboxOption
        text="Option 1"
        secondaryText="(recommended)"
        value="option1"
        checked
      />
      <Combobox.CheckboxOption text="Option 2" value="option2" />
      <Combobox.CheckboxOption text="Option 3" value="option3" />
    </Combobox.Group>
  {/snippet}
</Story>
