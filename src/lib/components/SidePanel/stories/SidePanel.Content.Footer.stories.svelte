<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SidePanel } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/SidePanel/Content/Footer",
    tags: ["autodocs"],
    component: SidePanel.Content.Footer,
  });
</script>

<Story name="Default" asChild>
  <SidePanel.Content.Footer>
    <Button>Reset</Button>
    <Button severity="positive">Apply</Button>
  </SidePanel.Content.Footer>
</Story>
