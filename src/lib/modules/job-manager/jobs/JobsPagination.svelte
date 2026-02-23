<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements";
  import type { JobsListMetadata } from "$lib/api/job-manager/types.js";
  import { Button, Pagination } from "$lib/components/index.js";
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
    Math.ceil(metadata.total_count / metadata.limit),
  );

  const currentPage = $derived(toPageNumber(metadata.offset, metadata.limit));

  const pageChangeHref = (pageNumber: number) => {
    const url = new URL(page.url);
    if (pageNumber === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", pageNumber.toString());
    }
    return url.pathname + url.search;
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
      invalidate: ["/jobs"],
    });
  };

  const selectPage: HTMLSelectAttributes["onchange"] = (e) => {
    const url = new URL(page.url);
    if (e.currentTarget.value === "1") {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", e.currentTarget.value);
    }

    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url.toString(), {
      noScroll: true,
      invalidate: ["/jobs"],
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
    </form>
    <Pagination.ItemsCount showing={numJobs} total={metadata.total_count} />
  {/snippet}
  {#snippet rightGroup()}
    <form method="GET" data-sveltekit-noscroll>
      <Pagination.PageSelect
        totalPages={numberOfPages}
        name="page"
        value={currentPage}
        onchange={selectPage}
      >
        {#each { length: numberOfPages }, i (i)}
          <option value={i + 1}>{i + 1}</option>
        {/each}
      </Pagination.PageSelect>
      {@render noScriptSubmit()}
      {#if metadata.limit !== jobsTableLimitDefault}
        <input type="hidden" name="limit" value={metadata.limit} />
      {/if}
      {#if page.url.searchParams.get("sort")}
        <input
          type="hidden"
          name="sort"
          value={page.url.searchParams.get("sort")}
        />
      {/if}
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
