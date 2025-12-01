<script module lang="ts">
  import { Edit } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Combobox } from "../../../index.js";
  import RadioOption from "./RadioOption.svelte";

  const { Story } = defineMeta({
    title: "Components/Combobox/RadioOption",
    tags: ["autodocs"],
    component: RadioOption,
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
    <Combobox.RadioOption {...args} />
  {/snippet}
</Story>

<Story name="With secondary text" args={{ secondaryText: "Secondary Text" }}>
  {#snippet template(args)}
    <Combobox.RadioOption {...args} />
  {/snippet}
</Story>

<Story name="With trailing text" args={{ trailingText: "Trailing Text" }}>
  {#snippet template(args)}
    <Combobox.RadioOption {...args} />
  {/snippet}
</Story>

<Story name="With icon">
  {#snippet template(args)}
    <Combobox.RadioOption {...args}>
      {#snippet icon()}
        <Edit />
      {/snippet}
    </Combobox.RadioOption>
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
    <Combobox.RadioOption {...args}>
      {#snippet icon()}
        <Edit />
      {/snippet}
    </Combobox.RadioOption>
  {/snippet}
</Story>
