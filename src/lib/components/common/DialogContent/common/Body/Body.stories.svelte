<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { DialogContent } from "../../index.js";
  import Body from "./Body.svelte";

  const { Story } = defineMeta({
    title: "Components/DialogContent/Body",
    tags: ["autodocs"],
    component: Body,
    argTypes: {
      children: {
        control: { disable: true },
      },
    },
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <DialogContent.Body {...args}>
      This is the body of the dialog. It contains the main content.
    </DialogContent.Body>
  {/snippet}
</Story>
