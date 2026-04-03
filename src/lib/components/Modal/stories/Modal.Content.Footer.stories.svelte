<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Modal } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/Modal/Content/Footer",
    tags: ["autodocs"],
    component: Modal.Content.Footer,
  });
</script>

<Story name="Default" asChild>
  <Modal.Content.Footer>
    <Button>Cancel</Button>
    <Button severity="positive">Save</Button>
  </Modal.Content.Footer>
</Story>
