<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { DialogContent } from "../../index.js";
  import Header from "./Header.svelte";

  const { Story } = defineMeta({
    title: "Components/DialogContent/Header",
    tags: ["autodocs"],
    component: Header,
    argTypes: {
      children: {
        control: { disable: true },
      },
    },
  });
</script>

<Story name="Default" asChild>
  <DialogContent.Header>This is a dialog header</DialogContent.Header>
</Story>

<Story name="With a close button" asChild>
  <DialogContent.Header>
    This is a dialog header
    <DialogContent.Header.CloseButton />
  </DialogContent.Header>
</Story>
