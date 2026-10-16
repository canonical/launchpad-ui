<script lang="ts">
  import { Spinner } from "@canonical/svelte-ds-app-launchpad";
  import { isHttpError } from "@sveltejs/kit";
  import { untrack } from "svelte";
  import { PartialTextDisclosure } from "$lib/components/index.js";
  import { SidePanel } from "$lib/launchpad-components/index.js";
  import { getPackagesContext } from "../context.js";
  import { BINARY_PACKAGE_QUERY_PARAM, QueryParams } from "../superhref.js";
  import ArtifactsSection from "./ArtifactsSection.svelte";
  import { getBinaryPackage } from "./binary-package.remote.js";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  let {
    distro,
    binaryId,
  }: {
    distro: string;
    binaryId: string | null;
  } = $props();

  const context = getPackagesContext();
  const queryParams = $derived(context.queryParams);

  const open = $derived(binaryId !== null);
  const binaryPackage = $derived(
    binaryId !== null ? getBinaryPackage({ distro, binaryId }) : undefined,
  );
  const serverDetails = browser
    ? undefined
    : await untrack(() => binaryPackage);
</script>

<SidePanel
  title={(browser ? binaryPackage?.current : serverDetails)
    ?.binary_package_name ?? "Binary package"}
  {open}
  closeForm={{
    schema: QueryParams,
    replaceParams: [BINARY_PACKAGE_QUERY_PARAM],
  }}
  onclose={() =>
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(queryParams.set("binary-package", null), {
      keepFocus: true,
      noScroll: true,
    })}
>
  {#if binaryPackage}
    {#key binaryPackage}
      <svelte:boundary pending={browser ? pending : undefined}>
        {const details = $derived(await binaryPackage)}
        {#if details.summary}
          <p class="summary">{details.summary}</p>
        {/if}
        <PartialTextDisclosure text={details.description} />
        {#if details.files.length}
          <ArtifactsSection artifacts={details.files} />
        {/if}
        {#snippet failed(error)}
          <p class="package-details-error" role="alert">
            {isHttpError(error)
              ? error.body.message
              : error instanceof Error
                ? error.message
                : "Couldn't load binary package details."}
          </p>
        {/snippet}
      </svelte:boundary>
    {/key}
  {/if}
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
    font: var(--ds-typography-heading-4);
  }
</style>
