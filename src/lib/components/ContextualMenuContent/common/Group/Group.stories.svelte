<script module lang="ts">
  import {
    ArchiveIcon,
    BackToTopIcon,
    NotificationsIcon,
    SettingsIcon,
  } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ContextualMenuContent } from "../../index.js";
  import Group from "./Group.svelte";

  const { Story } = defineMeta({
    title: "Components/ContextualMenuContent/Group",
    tags: ["autodocs"],
    component: Group,
    args: {
      groupTitle: "Group Title",
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <ContextualMenuContent.Group {...args}>
      <ContextualMenuContent.ButtonItem text="Button" />
      <ContextualMenuContent.ButtonItem
        href="http://example.com"
        text="Link (disabled)"
        disabled
      />
      <ContextualMenuContent.CheckboxItem text="Checkbox" />
      <ContextualMenuContent.RadioItem text="Radio (disabled)" disabled />
      <ContextualMenuContent.SwitchItem text="Switch" />
    </ContextualMenuContent.Group>
  {/snippet}
</Story>

<Story
  name="Of checkboxes"
  args={{
    groupTitle: "Preferences",
  }}
>
  {#snippet template(args)}
    <ContextualMenuContent.Group {...args}>
      <ContextualMenuContent.CheckboxItem
        text="Show whitespace changes"
        secondaryText="Whitespace changes are ignored by default"
      />
      <ContextualMenuContent.CheckboxItem text="Show file at a time" />
      <ContextualMenuContent.CheckboxItem text="Wrap overflowing code lines"
        >{#snippet icon()}
          <BackToTopIcon />
        {/snippet}
      </ContextualMenuContent.CheckboxItem>
    </ContextualMenuContent.Group>
  {/snippet}
</Story>

<Story
  name="Of radios"
  args={{
    groupTitle: "Theme",
  }}
>
  {#snippet template(args)}
    <ContextualMenuContent.Group {...args}>
      <ContextualMenuContent.RadioItem
        text="Light"
        name="theme"
        value="light"
        checked
      />
      <ContextualMenuContent.RadioItem text="Dark" name="theme" value="dark" />
      <ContextualMenuContent.RadioItem
        text="System"
        name="theme"
        secondaryText="(recommended)"
        value="system"
      />
    </ContextualMenuContent.Group>
  {/snippet}
</Story>

<Story
  name="Of switches"
  args={{
    groupTitle: "Settings",
  }}
>
  {#snippet template(args)}
    <ContextualMenuContent.Group {...args}>
      <ContextualMenuContent.SwitchItem
        text="Enable notifications"
        value="notifications"
      >
        {#snippet icon()}
          <NotificationsIcon />
        {/snippet}
      </ContextualMenuContent.SwitchItem>
      <ContextualMenuContent.SwitchItem
        text="Auto-save changes"
        value="auto-save"
      >
        {#snippet icon()}
          <ArchiveIcon />
        {/snippet}
      </ContextualMenuContent.SwitchItem>
      <ContextualMenuContent.SwitchItem
        text="Show advanced options"
        trailingText="(beta)"
        value="advanced-options"
      >
        {#snippet icon()}
          <SettingsIcon />
        {/snippet}
      </ContextualMenuContent.SwitchItem>
    </ContextualMenuContent.Group>
  {/snippet}
</Story>
