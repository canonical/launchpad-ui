<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { ComboboxContent } from "../../index.js";
  import Footer from "./Footer.svelte";

  const { Story } = defineMeta({
    title: "Components/ComboboxContent/Footer",
    tags: ["autodocs"],
    component: Footer,
  });
</script>

<Story name="Default" asChild>
  <ComboboxContent.Footer>
    <Button modifiers={{ severity: "base", density: "dense" }}>Cancel</Button>
    <Button modifiers={{ density: "dense" }}>Save</Button>
  </ComboboxContent.Footer>
</Story>
