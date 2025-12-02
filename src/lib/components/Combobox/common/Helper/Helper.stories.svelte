<script module lang="ts">
  import { InformationIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Combobox } from "../../index.js";
  import { Helper } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Combobox/Helper",
    tags: ["autodocs"],
    component: Helper,
    args: {
      id: "helper-id",
    },
    argTypes: {
      icon: {
        control: false,
      },
      children: {
        control: false,
      },
    },
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <Combobox.Helper {...args}>Helper text</Combobox.Helper>
  {/snippet}
</Story>

<Story name="With icon">
  {#snippet template({ children: _, ...args })}
    <Combobox.Helper {...args}>
      {#snippet icon()}
        <InformationIcon />
      {/snippet}
      Helper text
    </Combobox.Helper>
  {/snippet}
</Story>
