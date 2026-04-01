<script lang="ts">
  import type {
    HTMLInputAttributes,
    HTMLSelectAttributes,
  } from "svelte/elements";
  import type { JobsListMetadata } from "$lib/api/job-manager/types.js";
  import { Button, Pagination } from "$lib/components/index.js";
  import KeepQueryInput from "$lib/launchpad-components/KeepQueryInput.svelte";
  import {
    jobsTableLimitDefault,
    jobsTableLimitOptions,
    toPageNumber,
  } from "./pagination.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  const {
    tableId,
    metadata,
    numJobs,
  }: { tableId: string; metadata: JobsListMetadata; numJobs: number } =
    $props();

  const numberOfPages = $derived(
    Math.max(Math.ceil(metadata.total_count / metadata.limit), 1),
  );

  const currentPage = $derived(toPageNumber(metadata.offset, metadata.limit));

  const pageChangeHref = (pageNumber: number) => {
    const url = new URL(page.url);
    if (pageNumber === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", pageNumber.toString());
    }
    return url.search || "?";
  };

  const selectLimit: HTMLSelectAttributes["onchange"] = (e) => {
    const url = new URL(page.url);
    if (e.currentTarget.value === jobsTableLimitDefault.toString()) {
      url.searchParams.delete("limit");
    } else {
      url.searchParams.set("limit", e.currentTarget.value);
    }
    url.searchParams.delete("page"); // Reset to first page when limit changes

    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url.toString(), {
      replaceState: true,
      noScroll: true,
    });
  };

  const selectPage: HTMLInputAttributes["onblur"] = (e) => {
    const newPageNumber = Number(e.currentTarget.value);
    if (isNaN(newPageNumber)) return;

    const clampedPageNumber = Math.min(
      Math.max(newPageNumber, 1),
      numberOfPages,
    );
    if (clampedPageNumber === currentPage) return;

    const url = new URL(page.url);
    if (clampedPageNumber === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", clampedPageNumber.toString());
    }

    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url.toString(), {
      replaceState: true,
      noScroll: true,
    });
  };
</script>

<Pagination {tableId}>
  {#snippet leftGroup()}
    <form method="GET" data-sveltekit-noscroll>
      <Pagination.ItemsPerPageSelect
        name="limit"
        value={metadata.limit}
        onchange={selectLimit}
      >
        {#each jobsTableLimitOptions as option (option)}
          <option value={option}>
            {option}
          </option>
        {/each}
      </Pagination.ItemsPerPageSelect>
      {@render noScriptSubmit()}
      <KeepQueryInput name="sort" />
      <KeepQueryInput name="architecture" />
      <KeepQueryInput name="status" />
    </form>
    <Pagination.ItemsCount showing={numJobs} total={metadata.total_count} />
  {/snippet}
  {#snippet rightGroup()}
    <form method="GET" data-sveltekit-noscroll>
      <Pagination.PageInput
        totalPages={numberOfPages}
        name="page"
        value={currentPage}
        onblur={selectPage}
      />
      {@render noScriptSubmit()}
      <KeepQueryInput name="limit" />
      <KeepQueryInput name="sort" />
      <KeepQueryInput name="architecture" />
      <KeepQueryInput name="status" />
    </form>
  {/snippet}
  <Pagination.PageNavigation
    direction="first"
    disabled={currentPage === 1}
    href={pageChangeHref(1)}
    data-sveltekit-noscroll
  />
  <Pagination.PageNavigation
    direction="previous"
    disabled={currentPage === 1}
    href={pageChangeHref(currentPage - 1)}
    data-sveltekit-noscroll
  />
  <Pagination.PageNavigation
    direction="next"
    disabled={currentPage === numberOfPages}
    href={pageChangeHref(currentPage + 1)}
    data-sveltekit-noscroll
  />
  <Pagination.PageNavigation
    direction="last"
    disabled={currentPage === numberOfPages}
    href={pageChangeHref(numberOfPages)}
    data-sveltekit-noscroll
  />
</Pagination>

{#snippet noScriptSubmit()}
  <noscript>
    <Button type="submit" severity="base" density="compact">Apply</Button>
  </noscript>
{/snippet}

<style>
  form {
    display: flex;
    align-items: center;
    gap: var(--lp-dimension-spacing-inline-xs);
  }
</style>
