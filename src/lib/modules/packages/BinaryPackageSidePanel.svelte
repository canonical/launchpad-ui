<script lang="ts">
  import {
    Button,
    Link,
    SidePanel,
    Spinner,
  } from "@canonical/svelte-ds-app-launchpad";
  import { DownloadIcon } from "@canonical/svelte-icons";
  import { PartialTextDisclosure } from "$lib/components/index.js";
  import { QueryParamHiddenInput } from "$lib/launchpad-components/index.js";
  import { bytesToHumanReadable } from "$lib/utils/index.js";
  import { getBinaryPackage } from "./binary-package.remote.js";
  import { getPackagesContext } from "./context.js";
  import { BINARY_PACKAGE_QUERY_PARAM } from "./superhref.js";
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

  // Disable light dismiss when no JS, because otherwise we wouldn't have a way to clear the query param.
  const closeOnOutsideSuppress = !browser
    ? // Use `closedby: none` directly to also suppress the native platform dismissal (e.g. Escape key)
      { closedby: "none" as const }
    : // After hydration, switch to `closeOnOutsideClick` to get the WebKit fallback. To be removed, when the below TODO(DAL) is resolved.
      { closeOnOutsideClick: true };
</script>

<!-- 
TODO(DAL):
- Update SidePanel spacing to match the design
- Get rid of the `closeOnOutsideClick` prop and instead make the consumer use the native `closedby` directly while still keeping the fallback behavior for WebKit. (https://warthogs.atlassian.net/browse/LP-4467)
FIXME(DAL): When underlying dialog is upgrading to modal, it should suppress `onclose`, which currently closes our side panel on hydration. (https://github.com/canonical/pragma/pull/887)
-->
<SidePanel
  {open}
  {...closeOnOutsideSuppress}
  onclose={() =>
    goto(queryParams.set("binary-package", null), {
      keepFocus: true,
      noScroll: true,
    })}
>
  {#snippet children(commandfor)}
    <SidePanel.Content>
      <SidePanel.Content.Header>
        <h2>{name}</h2>
        {#if browser}
          <SidePanel.Content.Header.CloseButton {commandfor} command="close" />
        {:else}
          <!-- We need to clear the query param when no JS is available -->
          <form method="GET" class="close-button-form">
            <!-- TODO(superhref): Replace with superhref when form inputs helper is added -->
            {#each page.url.searchParams
              .keys()
              .filter((name) => name !== BINARY_PACKAGE_QUERY_PARAM) as name (name)}
              <QueryParamHiddenInput {name} />
            {/each}
            <SidePanel.Content.Header.CloseButton type="submit" />
          </form>
        {/if}
      </SidePanel.Content.Header>
      <SidePanel.Content.Body>
        {#if binaryPackage}
          <svelte:boundary pending={browser ? pending : undefined}>
            {@const details = await binaryPackage}
            <p class="summary">{details.summary}</p>
            {#key name}
              <PartialTextDisclosure text={details.description} />
            {/key}
            {#if details.artifacts.length > 0}
              <section class="artifacts">
                <header>
                  <h3>Artifacts</h3>
                  {#if details.artifacts.length > 1}
                    <Button
                      severity="base"
                      class="download-all"
                      density="dense"
                      href={details.downloadUrl}
                      download
                      rel="external noopener noreferrer"
                    >
                      {#snippet iconLeft()}
                        <DownloadIcon />
                      {/snippet}
                      Download all ({bytesToHumanReadable(
                        details.artifacts.reduce(
                          (acc, artifact) => acc + artifact.size,
                          0,
                        ),
                      )})
                    </Button>
                  {/if}
                </header>
                <ul class="artifacts-list">
                  {#each details.artifacts as artifact (artifact.id)}
                    <li>
                      <Link
                        href={artifact.url}
                        download={artifact.fileName}
                        soft
                        target="_blank"
                        rel="external noopener noreferrer"
                      >
                        {artifact.fileName}
                      </Link>
                      <span class="size"
                        >{bytesToHumanReadable(artifact.size)}</span
                      >
                    </li>
                  {/each}
                </ul>
              </section>
            {/if}
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
  <!-- TODO(@Enzo): How should the loading state look like -->
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

  h2 {
    font: var(--lp-typography-h3);
  }

  h3,
  .summary {
    font: var(--lp-typography-h4);
  }

  .artifacts {
    margin-block-start: var(--lp-dimension-spacing-block-l);
    border-block-start: var(--lp-dimension-stroke-thickness-default) solid
      var(--lp-color-border-default);
    padding-block-start: var(--lp-dimension-spacing-block-m);

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--lp-dimension-spacing-inline-l);
      margin-block-end: var(--lp-dimension-spacing-block-s);
    }

    ul {
      list-style: none;

      > li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--lp-dimension-spacing-block-xs);

        &:not(:last-child) {
          margin-block-end: var(--lp-dimension-spacing-block-xs);
        }

        .size {
          color: var(--lp-color-text-muted);
          flex-shrink: 0;
        }
      }
    }
  }
</style>
