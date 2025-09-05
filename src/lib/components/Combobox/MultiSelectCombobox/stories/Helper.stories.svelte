<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { Helper } from "../../common/index.js";

  const { Story } = defineMeta({
    title: "Components/MultiSelectCombobox/Helper",
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

<Story name="Default">Helper text</Story>

<Story name="With icon">
  {#snippet template({ children: _, ...args })}
    <Helper {...args}>
      {#snippet icon()}
        <Icon name="information" />
      {/snippet}
      Helper text
    </Helper>
  {/snippet}
</Story>
