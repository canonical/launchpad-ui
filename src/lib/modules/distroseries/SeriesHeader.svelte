<script lang="ts">
  import { Button, Chip, Popover } from "@canonical/svelte-ds-app-launchpad";
  import { SettingsIcon } from "@canonical/svelte-icons";
  import { ContextualMenuContent } from "#lib/components/index.js";

  let {
    displayName,
    status,
    adminLinks,
  }: {
    displayName: string;
    status: string;
    adminLinks: { changeDetails?: string; administer?: string };
  } = $props();
</script>

<header>
  <div class="page-title">
    <h1>{displayName}</h1>
    <Chip value={status} criticality="information" readonly />
  </div>
  {#if adminLinks.changeDetails || adminLinks.administer}
    <Popover position="block-end span-inline-start">
      {#snippet trigger(triggerProps)}
        <Button {...triggerProps} importance="tertiary" density="dense">
          {#snippet iconLeft()}
            <SettingsIcon aria-hidden="true" />
          {/snippet}
          Admin
        </Button>
      {/snippet}
      <ContextualMenuContent>
        <ContextualMenuContent.Group>
          {#if adminLinks.changeDetails}
            <ContextualMenuContent.ButtonItem
              text="Change details"
              href={adminLinks.changeDetails}
            />
          {/if}
          {#if adminLinks.administer}
            <ContextualMenuContent.ButtonItem
              text="Administer"
              href={adminLinks.administer}
            />
          {/if}
        </ContextualMenuContent.Group>
      </ContextualMenuContent>
    </Popover>
  {/if}
</header>

<style>
  header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: var(--space-300);

    > :global(.ds.button:has(+ :popover-open)) {
      background-color: var(--color-foreground-ghost-active);
    }
  }

  .page-title {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--space-100);
  }
</style>
