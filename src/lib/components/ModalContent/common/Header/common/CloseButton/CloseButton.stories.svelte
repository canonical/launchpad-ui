<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ModalContent } from "../../../../index.js";
  import CloseButton from "./CloseButton.svelte";

  const { Story } = defineMeta({
    title: "Components/ModalContent/Header/CloseButton",
    tags: ["autodocs"],
    component: CloseButton,
  });
</script>

<Story name="Default" asChild>
  <ModalContent.Header.CloseButton />
</Story>
