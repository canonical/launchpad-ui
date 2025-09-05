<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { Helper } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/ComboboxContent/Helper",
    tags: ["autodocs"],
    component: Helper,
    args: {
      id: "helper-id",
    },
    argTypes: {
      icon: {
        control: false,
      },
    },
  });
</script>

<Story name="Default">Helper text</Story>

<Story name="With icon">
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#snippet template({ children, ...args })}
    <Helper {...args}>
      {#snippet icon()}
        <Icon name="information" />
      {/snippet}
      Helper text
    </Helper>
  {/snippet}
</Story>
