<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SidePanel } from "../index.js";

  const { Story } = defineMeta({
    title: "Components/SidePanel/Content",
    tags: ["autodocs"],
    component: SidePanel.Content,
  });
</script>

<Story name="Default" asChild>
  <SidePanel.Content>
    <SidePanel.Content.Header>
      Edit job configuration
      <SidePanel.Content.Header.CloseButton />
    </SidePanel.Content.Header>
    <SidePanel.Content.Body>
      Update timeout, retry strategy, and notification rules while keeping the
      jobs list visible in the background.
    </SidePanel.Content.Body>
    <SidePanel.Content.Footer>
      <Button>Reset</Button>
      <Button severity="positive">Apply changes</Button>
    </SidePanel.Content.Footer>
  </SidePanel.Content>
</Story>
