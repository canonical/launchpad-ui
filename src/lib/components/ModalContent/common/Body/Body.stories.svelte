<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import { ModalContent } from "../../index.js";
  import Body from "./Body.svelte";

  const { Story } = defineMeta({
    title: "Components/ModalContent/Body",
    tags: ["autodocs"],
    component: Body,
    argTypes: {
      children: {
        description: "The content of the modal body",
        table: { type: { summary: "Snippet<[]>" } },
      },
    },
    args: {
      children: "This is the body of a modal" as unknown as Snippet,
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <ModalContent.Body {...args} />
  {/snippet}
</Story>
