<script lang="ts">
  import { SidePanel, Spinner } from "@canonical/svelte-ds-app-launchpad";
  import QueryParamHiddenInput from "$lib/launchpad-components/QueryParamHiddenInput.svelte";
  import { getBinaryPackage } from "./binary-package.remote.js";
  import { BINARY_PACKAGE } from "./query-params.js";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  let {
    name,
  }: {
    name?: string;
  } = $props();

  const open = $derived(Boolean(name));

  // Disable light dismiss when no JS, because otherwise we wouldn't have a way to clear the query param.
  const closeOnOutsideClick = $derived(browser);

  const onclose = () => {
    // TODO(superhref): Replace with superhref
    const url = new URL(page.url);
    if (!url.searchParams.has(BINARY_PACKAGE)) return;
    url.searchParams.delete(BINARY_PACKAGE);

    // eslint-disable-next-line svelte/no-navigation-without-resolve
    void goto(url, {
      keepFocus: true,
      noScroll: true,
    });
  };
</script>

<SidePanel {open} {closeOnOutsideClick} {onclose}>
  {#snippet children(commandfor)}
    <SidePanel.Content>
      <SidePanel.Content.Header>
        <h2>{name}</h2>
        {#if browser}
          <SidePanel.Content.Header.CloseButton {commandfor} command="close" />
        {:else}
          <!-- We need to clear the query param when no JS is available -->
          <form method="GET" class="close-button-form">
            <!-- TODO(superhref): Replace with superhref -->
            {#each page.url.searchParams
              .keys()
              .filter((name) => name !== BINARY_PACKAGE) as name (name)}
              <QueryParamHiddenInput {name} />
            {/each}
            <SidePanel.Content.Header.CloseButton type="submit" />
          </form>
        {/if}
      </SidePanel.Content.Header>
      <SidePanel.Content.Body>
        {#if name}
          <svelte:boundary pending={browser ? pending : undefined}>
            {@const binaryPackage = await getBinaryPackage(name)}
            <dl class="package-details">
              <div>
                <dt>Version</dt>
                <dd>{binaryPackage.version}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{binaryPackage.status}</dd>
              </div>
              <div>
                <dt>Pocket</dt>
                <dd>{binaryPackage.pocket}</dd>
              </div>
              <div>
                <dt>Component</dt>
                <dd>{binaryPackage.component}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{binaryPackage.priority}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{binaryPackage.source}</dd>
              </div>
              <div>
                <dt>Build</dt>
                <dd>{binaryPackage.build}</dd>
              </div>
              <div>
                <dt>Package size</dt>
                <dd>{binaryPackage.debPackage.size}</dd>
              </div>
            </dl>

            {#snippet failed(error)}
              <p class="package-details-error">{String(error)}</p>
            {/snippet}
          </svelte:boundary>
        {/if}
      </SidePanel.Content.Body>
    </SidePanel.Content>
  {/snippet}
</SidePanel>

{#snippet pending()}
  <div class="pending"><Spinner />Loading package details…</div>
{/snippet}

<style>
  .pending {
    display: flex;
    align-items: center;
    gap: var(--lp-dimension-spacing-inline-xxs);
  }

  .close-button-form {
    display: contents;

    > :global(button) {
      margin-inline-start: auto;
    }
  }
</style>
