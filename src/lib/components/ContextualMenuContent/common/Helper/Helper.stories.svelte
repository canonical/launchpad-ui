<script module lang="ts">
  import { Information } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ContextualMenuContent } from "../../index.js";
  import { Helper } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/ContextualMenuContent/Helper",
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
    <ContextualMenuContent.Helper {...args}>
      {#snippet icon()}
        <Information />
      {/snippet}
      Helper text
    </ContextualMenuContent.Helper>
  {/snippet}
</Story>
