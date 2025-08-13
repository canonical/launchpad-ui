<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import Group from "./Group.svelte";
  import {
    ButtonItem,
    CheckboxItem,
    LinkItem,
    RadioItem,
    SwitchItem,
  } from "./common/index.js";

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
  <ButtonItem text="Button" />
  <LinkItem text="Link (disabled)" disabled />
  <CheckboxItem text="Checkbox" />
  <RadioItem text="Radio (disabled)" disabled />
  <SwitchItem text="Switch" />
</Story>

<Story
  name="Of checkboxes"
  args={{
    groupTitle: "Preferences",
  }}
>
  <CheckboxItem
    text="Show whitespace changes"
    secondaryText="Whitespace changes are ignored by default"
  />
  <CheckboxItem text="Show file at a time" />
  <CheckboxItem text="Wrap overflowing code lines"
    >{#snippet icon()}
      <Icon name="back-to-top" />
    {/snippet}
  </CheckboxItem>
</Story>

<Story
  name="Of radios"
  args={{
    groupTitle: "Theme",
  }}
>
  <RadioItem text="Light" name="theme" value="light" checked />
  <RadioItem text="Dark" name="theme" value="dark" />
  <RadioItem
    text="System"
    name="theme"
    secondaryText="(recommended)"
    value="system"
  />
</Story>

<Story
  name="Of switches"
  args={{
    groupTitle: "Settings",
  }}
>
  <SwitchItem text="Enable notifications" value="notifications">
    {#snippet icon()}
      <Icon name="notifications" />
    {/snippet}
  </SwitchItem>
  <SwitchItem text="Auto-save changes" value="auto-save">
    {#snippet icon()}
      <Icon name="archive" />
    {/snippet}
  </SwitchItem>
  <SwitchItem
    text="Show advanced options"
    trailingText="(beta)"
    value="advanced-options"
  >
    {#snippet icon()}
      <Icon name="settings" />
    {/snippet}
  </SwitchItem>
</Story>
