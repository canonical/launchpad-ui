<script module lang="ts">
  import { Edit } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Combobox } from "../../../index.js";
  import CheckboxOption from "./CheckboxOption.svelte";

  const { Story } = defineMeta({
    title: "Components/Combobox/CheckboxOption",
    tags: ["autodocs"],
    component: CheckboxOption,
    argTypes: {
      icon: {
        control: false,
      },
    },
    args: {
      text: "Text",
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <Combobox.CheckboxOption {...args} />
  {/snippet}
</Story>

<Story name="With secondary text" args={{ secondaryText: "Secondary Text" }}>
  {#snippet template(args)}
    <Combobox.CheckboxOption {...args} />
  {/snippet}
</Story>

<Story name="With trailing text" args={{ trailingText: "Trailing Text" }}>
  {#snippet template(args)}
    <Combobox.CheckboxOption {...args} />
  {/snippet}
</Story>

<Story name="With icon">
  {#snippet template(args)}
    <Combobox.CheckboxOption {...args}>
      {#snippet icon()}
        <Edit />
      {/snippet}
    </Combobox.CheckboxOption>
  {/snippet}
</Story>

<Story
  name="With all contents"
  args={{
    secondaryText: "Secondary Text",
    trailingText: "Trailing Text",
  }}
>
  {#snippet template(args)}
    <Combobox.CheckboxOption {...args}>
      {#snippet icon()}
        <Edit />
      {/snippet}
    </Combobox.CheckboxOption>
  {/snippet}
</Story>
