<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { ModalContent } from "../../index.js";
  import Footer from "./Footer.svelte";

  const { Story } = defineMeta({
    title: "Components/ModalContent/Footer",
    tags: ["autodocs"],
    component: Footer,
  });
</script>

<Story name="Default" asChild>
  <ModalContent.Footer>
    <Button>Cancel</Button>
    <Button modifiers={{ severity: "positive" }}>Save</Button>
  </ModalContent.Footer>
</Story>
