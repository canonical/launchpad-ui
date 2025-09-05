<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { Footer } from "../../common/index.js";
  import { MultiSelectCombobox } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/MultiSelectCombobox/Footer",
    tags: ["autodocs"],
    component: Footer,
  });
</script>

<Story name="Default" asChild>
  <MultiSelectCombobox.Footer>
    <Button modifiers={{ severity: "base", density: "dense" }}>Cancel</Button>
    <Button modifiers={{ density: "dense" }}>Save</Button>
  </MultiSelectCombobox.Footer>
</Story>
