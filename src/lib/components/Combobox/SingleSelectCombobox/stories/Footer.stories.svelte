<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { Footer } from "../../common/index.js";
  import { SingleSelectCombobox } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/SingleSelectCombobox/Footer",
    tags: ["autodocs"],
    component: Footer,
  });
</script>

<Story name="Default" asChild>
  <SingleSelectCombobox.Footer>
    <Button modifiers={{ severity: "base", density: "dense" }}>Cancel</Button>
    <Button modifiers={{ density: "dense" }}>Save</Button>
  </SingleSelectCombobox.Footer>
</Story>
