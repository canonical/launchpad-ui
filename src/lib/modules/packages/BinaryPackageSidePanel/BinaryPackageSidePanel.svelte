<script lang="ts">
  import { Spinner } from "@canonical/svelte-ds-app-launchpad";
  import { PartialTextDisclosure } from "$lib/components/index.js";
  import {
    QueryParamHiddenInput,
    SidePanel,
  } from "$lib/launchpad-components/index.js";
  import { getPackagesContext } from "../context.js";
  import { BINARY_PACKAGE_QUERY_PARAM } from "../superhref.js";
  import ArtifactsSection from "./ArtifactsSection.svelte";
  import { getBinaryPackage } from "./binary-package.remote.js";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  let {
    name,
  }: {
    name: string | null;
  } = $props();

  const context = getPackagesContext();
  const queryParams = $derived(context.queryParams);

  const open = $derived(Boolean(name));
  const binaryPackage = $derived(name ? getBinaryPackage(name) : undefined);
</script>

<SidePanel
  title={name ?? undefined}
  {open}
  onclose={() =>
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(queryParams.set("binary-package", null), {
      keepFocus: true,
      noScroll: true,
    })}
>
  {#if binaryPackage}
    <svelte:boundary pending={browser ? pending : undefined}>
      {@const details = await binaryPackage}
      <p class="summary">{details.summary}</p>
      {#key name}
        <PartialTextDisclosure text={details.description} />
      {/key}
      {#if details.artifacts.length > 0}
        <ArtifactsSection
          artifacts={details.artifacts}
          downloadUrl={details.downloadUrl}
        />
      {/if}
      {#snippet failed(error)}
        <p class="package-details-error">{String(error)}</p>
      {/snippet}
    </svelte:boundary>
  {/if}
  {#snippet closeFormContent()}
    {#each page.url.searchParams
      .keys()
      .filter((name) => name !== BINARY_PACKAGE_QUERY_PARAM) as name (name)}
      <QueryParamHiddenInput {name} />
    {/each}
  {/snippet}
</SidePanel>

{#snippet pending()}
  <!-- TODO(@Enzo): How should the loading state look like -->
  <div class="pending"><Spinner />Loading package details…</div>
{/snippet}

<style>
  .pending {
    display: flex;
    align-items: center;
    gap: var(--lp-dimension-spacing-inline-xxs);
  }

  .summary {
    font: var(--lp-typography-h4);
  }
</style>
