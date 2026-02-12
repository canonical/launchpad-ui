<script module lang="ts">
  import {
    ArchiveIcon,
    BackToTopIcon,
    ExternalLinkIcon,
    InformationIcon,
    NotificationsIcon,
    SettingsIcon,
  } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ContextualMenuContent } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/ContextualMenuContent",
    tags: ["autodocs"],
    component: ContextualMenuContent,
    argTypes: {
      helper: {
        control: false,
      },
    },
  });
</script>

<Story name="Default" asChild>
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Diff layout">
      <ContextualMenuContent.RadioItem
        value="inline"
        name="layout"
        checked
        text="Inline"
        secondaryText="Suitable for mobile devices"
      />
      <ContextualMenuContent.RadioItem
        value="side-by-side"
        name="layout"
        text="Side-by-side"
      />
    </ContextualMenuContent.Group>
    <ContextualMenuContent.Group groupTitle="Preferences">
      <ContextualMenuContent.CheckboxItem
        value="white-space"
        text="Show whitespace changes"
      />
      <ContextualMenuContent.CheckboxItem
        value="comments"
        text="Show comments"
      />
      <ContextualMenuContent.CheckboxItem
        value="wrap"
        text="Wrap overflowing code lines"
      >
        {#snippet icon()}
          <BackToTopIcon />
        {/snippet}
      </ContextualMenuContent.CheckboxItem>
    </ContextualMenuContent.Group>
    <ContextualMenuContent.Group groupTitle="Settings">
      <ContextualMenuContent.SwitchItem
        value="notifications"
        checked
        disabled
        text="Enable notifications"
        secondaryText="They are loud!"
      >
        {#snippet icon()}
          <NotificationsIcon />
        {/snippet}
      </ContextualMenuContent.SwitchItem>
      <ContextualMenuContent.SwitchItem
        value="auto-save"
        checked
        text="Auto-save changes"
      >
        {#snippet icon()}
          <ArchiveIcon />
        {/snippet}
      </ContextualMenuContent.SwitchItem>
      <ContextualMenuContent.SwitchItem
        value="advanced-options"
        text="Show advanced options"
        trailingText="(beta)"
      >
        {#snippet icon()}
          <SettingsIcon />
        {/snippet}
      </ContextualMenuContent.SwitchItem>
    </ContextualMenuContent.Group>
    <ContextualMenuContent.Group>
      <ContextualMenuContent.ButtonItem
        href="https://launchpad.net"
        target="_blank"
        rel="noopener noreferrer"
        text="View in Launchpad Classic"
      >
        {#snippet icon()}
          <ExternalLinkIcon />
        {/snippet}
      </ContextualMenuContent.ButtonItem>
      <ContextualMenuContent.ButtonItem
        href="/comments"
        text="See new comments"
        trailingText="4"
      />
    </ContextualMenuContent.Group>
    <ContextualMenuContent.Group groupTitle="Admin options" disabled>
      <ContextualMenuContent.ButtonItem
        text="Reset to default"
        secondaryText="This can't be undone"
      />
      <ContextualMenuContent.ButtonItem text="Do something dangerous" />
    </ContextualMenuContent.Group>
    {#snippet helper(id)}
      <ContextualMenuContent.Helper {id}>
        Use the options above to customize the view
        {#snippet icon()}
          <InformationIcon />
        {/snippet}
      </ContextualMenuContent.Helper>
    {/snippet}
  </ContextualMenuContent>
</Story>
