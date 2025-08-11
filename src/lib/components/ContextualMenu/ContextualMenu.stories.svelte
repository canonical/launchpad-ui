<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { ContextualMenu } from "./index.js";

  const { Story } = defineMeta({
    title: "ContextualMenu",
    tags: ["autodocs"],
    component: ContextualMenu,
  });
</script>

<Story name="Default" asChild>
  <ContextualMenu>
    <ContextualMenu.Group groupTitle="Diff layout">
      <ContextualMenu.RadioItem
        value="inline"
        name="layout"
        checked
        text="Inline"
        secondaryText="Suitable for mobile devices"
      />
      <ContextualMenu.RadioItem
        value="side-by-side"
        name="layout"
        text="Side-by-side"
      />
    </ContextualMenu.Group>
    <ContextualMenu.Group groupTitle="Preferences">
      <ContextualMenu.CheckboxItem
        value="white-space"
        text="Show whitespace changes"
      />
      <ContextualMenu.CheckboxItem value="comments" text="Show comments" />
      <ContextualMenu.CheckboxItem
        value="wrap"
        text="Wrap overflowing code lines"
      >
        {#snippet icon()}
          <Icon name="back-to-top" />
        {/snippet}
      </ContextualMenu.CheckboxItem>
    </ContextualMenu.Group>
    <ContextualMenu.Group groupTitle="Settings">
      <ContextualMenu.SwitchItem
        value="notifications"
        checked
        disabled
        text="Enable notifications"
        secondaryText="They are loud!"
      >
        {#snippet icon()}
          <Icon name="notifications" />
        {/snippet}
      </ContextualMenu.SwitchItem>
      <ContextualMenu.SwitchItem
        value="auto-save"
        checked
        text="Auto-save changes"
      >
        {#snippet icon()}
          <Icon name="archive" />
        {/snippet}
      </ContextualMenu.SwitchItem>
      <ContextualMenu.SwitchItem
        value="advanced-options"
        text="Show advanced options"
        trailingText="(beta)"
      >
        {#snippet icon()}
          <Icon name="settings" />
        {/snippet}
      </ContextualMenu.SwitchItem>
    </ContextualMenu.Group>
    <ContextualMenu.Group>
      <ContextualMenu.LinkItem
        href="https://launchpad.net"
        target="_blank"
        rel="noopener noreferrer"
        text="View in Launchpad Classic"
      >
        {#snippet icon()}
          <Icon name="external-link" />
        {/snippet}
      </ContextualMenu.LinkItem>
      <ContextualMenu.LinkItem
        href="/comments"
        text="See new comments"
        trailingText="4"
      />
    </ContextualMenu.Group>
    <ContextualMenu.Group groupTitle="Admin options" disabled>
      <ContextualMenu.ButtonItem
        text="Reset to default"
        secondaryText="This can't be undone"
      />
      <ContextualMenu.ButtonItem text="Do something dangerous" />
    </ContextualMenu.Group>
    {#snippet helper(id)}
      <ContextualMenu.Helper {id}>
        Use the options above to customize the view
        {#snippet icon()}
          <Icon name="information" />
        {/snippet}
      </ContextualMenu.Helper>
    {/snippet}
  </ContextualMenu>
</Story>
