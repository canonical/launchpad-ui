<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import { ModalContent } from "../../index.js";
  import Header from "./Header.svelte";

  const { Story } = defineMeta({
    title: "Components/ModalContent/Header",
    tags: ["autodocs"],
    component: Header,
    argTypes: {
      children: {
        description: "The content of the modal header",
        table: { type: { summary: "Snippet<[]>" } },
      },
    },
  });
</script>

<Story
  name="Default"
  args={{ children: "This is a modal header" as unknown as Snippet }}
>
  {#snippet template(args)}
    <ModalContent.Header {...args} />
  {/snippet}
</Story>

<Story
  name="With a close button"
  asChild
  argTypes={{ children: { table: { disable: true } } }}
>
  <ModalContent.Header>
    This is a modal header
    <ModalContent.Header.CloseButton />
  </ModalContent.Header>
</Story>
