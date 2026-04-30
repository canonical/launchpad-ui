<script lang="ts">
  import {
    Chip,
    DescriptionList,
    Tooltip,
  } from "@canonical/svelte-ds-app-launchpad";
  import {
    ErrorIcon,
    SuccessIcon,
    WarningFillIcon,
    WarningIcon,
  } from "@canonical/svelte-icons";
  import type {
    HealthResponse,
    ServiceStatus,
  } from "$lib/api/job-manager/types.js";

  const { health }: { health: HealthResponse } = $props();

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
</script>

{#if health.status !== "operational"}
  <div class="system-status">
    <div class="status-header">
      <h2>System Status</h2>
      <Chip
        value={capitalizeFirstLetter(health.status)}
        readonly
        severity={health.status === "degraded" ? "caution" : "negative"}
      >
        {#snippet icon()}
          {#if health.status === "operational"}
            <SuccessIcon aria-hidden="true" />
          {:else if health.status === "degraded"}
            <WarningIcon aria-hidden="true" />
          {:else if health.status === "outage"}
            <ErrorIcon aria-hidden="true" />
          {/if}
        {/snippet}</Chip
      >
    </div>
    {#if health.message}
      <p>{health.message}</p>
    {/if}
    <DescriptionList layout="grid" class="system-components">
      {#each Object.entries(health.details) as [componentName, component] (componentName)}
        <DescriptionList.Item name={componentName}>
          {#if component.message}
            <Tooltip position="block-end">
              {#snippet trigger(triggerProps)}
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <div class="status" tabindex="0" {...triggerProps}>
                  {@render statusBadge(component.status)}
                </div>
              {/snippet}
              {component.message}
            </Tooltip>
          {:else}
            <div class="status">
              {@render statusBadge(component.status)}
            </div>
          {/if}
        </DescriptionList.Item>
      {/each}
    </DescriptionList>
  </div>
{/if}

{#snippet statusBadge(status: ServiceStatus)}
  {#if status === "operational"}
    <SuccessIcon
      aria-hidden="true"
      style="color: var(--lp-color-icon-positive);"
    />
  {:else if status === "degraded"}
    <WarningFillIcon
      aria-hidden="true"
      style="color: var(--lp-color-icon-caution);"
    />
  {:else if status === "outage"}
    <ErrorIcon
      aria-hidden="true"
      style="color: var(--lp-color-icon-negative);"
    />
  {/if}
  {capitalizeFirstLetter(status)}
{/snippet}

<style>
  .system-status {
    display: flex;
    flex-direction: column;

    background: var(--lp-color-background-alt);
    gap: var(--lp-dimension-spacing-block-m);
    padding: var(--lp-dimension-spacing-block-l)
      var(--lp-dimension-spacing-inline-l);
    border: var(--lp-dimension-stroke-thickness-default) solid
      var(--lp-color-border-low-contrast);

    h2 {
      font: var(--lp-typography-h5);
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: var(--lp-dimension-spacing-inline-m);
      justify-content: space-between;
    }

    :global(.system-components) {
      --min-width-description-list-item: 100px;
      row-gap: var(--lp-dimension-spacing-block-l);
      column-gap: var(--lp-dimension-spacing-inline-m);

      .status {
        display: inline-flex;
        align-items: center;
        gap: var(--lp-dimension-spacing-inline-xs);
      }
    }
  }
</style>
