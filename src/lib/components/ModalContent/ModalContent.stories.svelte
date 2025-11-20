<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { ModalContent } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/ModalContent",
    tags: ["autodocs"],
    component: ModalContent,
  });
</script>

<Story name="Default" asChild>
  <ModalContent>
    <ModalContent.Header>
      Discard pending review?
      <ModalContent.Header.CloseButton />
    </ModalContent.Header>
    <ModalContent.Body>
      You have added 4 comments. Discarding the pending review will permanently
      delete them. Are you sure you want to continue?
    </ModalContent.Body>
    <ModalContent.Footer>
      <Button>Keep review</Button>
      <Button severity="negative">Discard review</Button>
    </ModalContent.Footer>
  </ModalContent>
</Story>
