<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "../../../../Button/index.js";
  import { DialogContent } from "../../index.js";
  import Footer from "./Footer.svelte";

  const { Story } = defineMeta({
    title: "Components/DialogContent/Footer",
    tags: ["autodocs"],
    component: Footer,
  });
</script>

<Story name="Default" asChild>
  <DialogContent.Footer>
    <Button>Cancel</Button>
    <Button severity="positive">Save</Button>
  </DialogContent.Footer>
</Story>
