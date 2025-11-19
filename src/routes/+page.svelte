<script>
  import Button from "$lib/components/Button/Button.svelte";
  import { AddCanvas, IconProvider } from "$lib/components/icons/index.js";

  const numberOfIcons = 7;
  const shown = $state(Array.from({ length: numberOfIcons }, () => true));
</script>

<IconProvider>
  {#each shown as isShown, i (i)}
    <div style="margin-bottom: 16px;">
      {#if isShown}
        <Button onclick={() => (shown[i] = false)}>
          <AddCanvas />
        </Button>
      {:else}
        <Button onclick={() => (shown[i] = true)}>Show</Button>
      {/if}
    </div>
  {/each}
</IconProvider>
