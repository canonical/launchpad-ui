<script lang="ts" module>
  export { children, expandToggle, footer, logo };
</script>

<script lang="ts">
  import { Icon } from "$lib/components/Icon/index.js";
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
      <Icon name="home" />
    {/snippet}
  </LinkItem>
  <ButtonItem>
    Button in nav
    {#snippet icon()}
      <Icon name="settings" />
    {/snippet}
  </ButtonItem>
{/snippet}

{#snippet footer()}
  <ButtonItem>
    Button in footer
    {#snippet icon()}
      <Icon name="color-palette" />
    {/snippet}
  </ButtonItem>
  <LinkItem href="/profile">
    Link in footer
    {#snippet icon()}
      <Icon name="user" />
    {/snippet}
  </LinkItem>
{/snippet}
