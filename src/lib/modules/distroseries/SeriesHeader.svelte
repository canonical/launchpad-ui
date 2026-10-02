<script lang="ts">
  import { Button, Chip } from "@canonical/svelte-ds-app-launchpad";
  import { SettingsIcon } from "@canonical/svelte-icons";

  let {
    displayName,
    status,
  }: {
    displayName: string;
    status: string;
  } = $props();
</script>

<header>
  <div class="page-title">
    <h1>{displayName}</h1>
    <Chip value={status} criticality="information" readonly />
  </div>
  <Button importance="tertiary" density="dense" disabled>
    {#snippet iconLeft()}
      <SettingsIcon aria-hidden="true" />
    {/snippet}
    Admin
  </Button>
</header>

<style>
  header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: var(--space-300);
  }

  .page-title {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--space-100);

    h1 {
      font: var(--typography-heading-1-font-weight)
        var(--typography-heading-1-font-size) /
        var(--typography-heading-1-line-height)
        var(--typography-heading-1-font-family);
    }
  }
</style>
