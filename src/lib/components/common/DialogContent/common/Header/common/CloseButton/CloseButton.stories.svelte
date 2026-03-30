<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { DialogContent } from "../../../../index.js";
  import CloseButton from "./CloseButton.svelte";

  const { Story } = defineMeta({
    title: "Components/DialogContent/Header/CloseButton",
    tags: ["autodocs"],
    component: CloseButton,
  });
</script>

<Story name="Default" asChild>
  <DialogContent.Header.CloseButton />
</Story>
