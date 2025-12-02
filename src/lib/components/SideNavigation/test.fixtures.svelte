<script lang="ts" module>
  export { children, expandToggle, footer, logo };
</script>

<script lang="ts">
  import { HomeIcon, SettingsIcon, UserIcon } from "@canonical/svelte-icons";
  import { ColorPalette } from "$lib/components/icons/index.js";
  import { ButtonItem, ExpandToggle, LinkItem } from "./common/index.js";
  import type { ExpandToggleProps } from "./types.js";
</script>

{#snippet logo()}
  <a href="/" aria-label="Logo link">Logo link</a>
{/snippet}

{#snippet expandToggle(toggleProps: ExpandToggleProps)}
  <ExpandToggle {...toggleProps} />
{/snippet}

{#snippet children()}
  <LinkItem href="/">
    Link in nav
    {#snippet icon()}
      <HomeIcon />
    {/snippet}
  </LinkItem>
  <ButtonItem>
    Button in nav
    {#snippet icon()}
      <SettingsIcon />
    {/snippet}
  </ButtonItem>
{/snippet}

{#snippet footer()}
  <ButtonItem>
    Button in footer
    {#snippet icon()}
      <ColorPalette />
    {/snippet}
  </ButtonItem>
  <LinkItem href="/profile">
    Link in footer
    {#snippet icon()}
      <UserIcon />
    {/snippet}
  </LinkItem>
{/snippet}
