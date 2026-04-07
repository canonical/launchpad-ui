<script lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { CloseIcon } from "@canonical/svelte-icons";
  import type { HTMLSelectAttributes } from "svelte/elements";
  import * as v from "valibot";
  import {
    architectureValues,
    jobStatusValues,
  } from "$lib/api/job-manager/types.js";
  import { Select } from "$lib/components/index.js";
  import { QueryParamHiddenInput } from "$lib/launchpad-components/index.js";
  import { architectureFilterSchema, statusFilterSchema } from "./filtering.js";
  import { JobsQueryParam } from "./queryParams.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  const { tableId }: { tableId: string } = $props();

  const id = $props.id();

  const updateFilters: HTMLSelectAttributes["onchange"] = async (e) => {
    const url = new URL(page.url);
    const { name, value } = e.currentTarget;

    if (value === "") {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, value);
    }
    url.searchParams.delete(JobsQueryParam.Page);

    // eslint-disable-next-line svelte/no-navigation-without-resolve
    await goto(url.toString(), {
      replaceState: true,
      noScroll: true,
    });
  };

  const statusFilterValue = $derived(
    v.parse(
      statusFilterSchema,
      page.url.searchParams.get(JobsQueryParam.FilterStatus),
    ),
  );

  const architectureFilterValue = $derived(
    v.parse(
      architectureFilterSchema,
      page.url.searchParams.get(JobsQueryParam.FilterArchitecture),
    ),
  );

  const isFiltering = $derived(statusFilterValue || architectureFilterValue);

  const resetFiltersHref = () => {
    const url = new URL(page.url);
    url.searchParams.delete(JobsQueryParam.FilterArchitecture);
    url.searchParams.delete(JobsQueryParam.FilterStatus);
    url.searchParams.delete(JobsQueryParam.Page);
    return url.search || "?";
  };
</script>

<search>
  <form method="GET">
    <div>
      <label for="{id}-arch">Arch: </label>
      <Select
        id="{id}-arch"
        name={JobsQueryParam.FilterArchitecture}
        class="select"
        onchange={updateFilters}
        aria-controls={tableId}
        value={architectureFilterValue ?? ""}
      >
        <option value="">All</option>
        {#each architectureValues as arch (arch)}
          <option>{arch}</option>
        {/each}
      </Select>
    </div>
    <div>
      <label for="{id}-status">Status: </label>
      <Select
        id="{id}-status"
        name={JobsQueryParam.FilterStatus}
        class="select"
        onchange={updateFilters}
        aria-controls={tableId}
        value={statusFilterValue ?? ""}
      >
        <option value="">All</option>
        {#each jobStatusValues as status (status)}
          <option>{status}</option>
        {/each}
      </Select>
    </div>
    <noscript>
      <Button type="submit" severity="base" density="dense">Apply</Button>
    </noscript>
    {#if isFiltering}
      <Button
        severity="base"
        density="dense"
        href={resetFiltersHref()}
        aria-controls={tableId}
      >
        {#snippet iconLeft()}
          <CloseIcon />
        {/snippet}
        Remove filters
      </Button>
    {/if}
    <QueryParamHiddenInput name={JobsQueryParam.Sort} />
    <QueryParamHiddenInput name={JobsQueryParam.Limit} />
  </form>
</search>

<style>
  form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    /* TODO: Add l-sized block padding after the tabs and searchbox added */

    gap: var(--lp-dimension-spacing-inline-m);

    label {
      color: var(--lp-color-text-muted);
    }

    :global {
      /* TODO: Artificial specificity boost due to scoping + ds class selector. Remove when Select upstreamed */
      .select.select select {
        background-color: transparent;
        border: none;
        font: var(--lp-typography-paragraph-s);
      }
    }
  }
</style>
