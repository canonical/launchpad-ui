<script module lang="ts">
  const COULD_NOT_LOAD = "Couldn't load";
</script>

<script lang="ts">
  import type { ClassValue } from "svelte/elements";
  import { Stat } from "#lib/launchpad-components/index.js";
  import { getSeriesBugCounts } from "./bugs/bugs.remote.js";
  import { getSeriesStatsImageCounts } from "./images/images.remote.js";

  type ImageCounts = NonNullable<
    Awaited<ReturnType<typeof getSeriesStatsImageCounts>>
  >;
  type BugCounts = Awaited<ReturnType<typeof getSeriesBugCounts>>;

  let {
    distro,
    series,
    class: className,
  }: {
    distro: string;
    series: string;
    class?: ClassValue;
  } = $props();

  // TODO: Revisit image counts after https://warthogs.atlassian.net/browse/LP-5179.
  function formatCount(value: number | undefined) {
    return value === undefined ? COULD_NOT_LOAD : String(value);
  }

  function formatProgress(
    completed: number | undefined,
    total: number | undefined,
  ) {
    if (completed === undefined || total === undefined) return COULD_NOT_LOAD;
    return `${completed}/${total}`;
  }

  function criticality(failures: number | undefined) {
    return failures === 0 ? "success" : "error";
  }
</script>

{#snippet imageStats(counts?: ImageCounts)}
  {const builds = $derived(counts?.building)}
  {const tests = $derived(counts?.testing)}
  <Stat>
    <Stat.Item
      term="Images built"
      details={formatProgress(builds?.successful, builds?.total)}
    />
    <Stat.Item
      term="Failed to build"
      details={formatCount(builds?.failed)}
      criticality={criticality(builds?.failed)}
    />
    <Stat.Item term="Building" details={formatCount(builds?.running)} />
  </Stat>
  <Stat>
    <Stat.Item
      term="Images passed tests"
      details={formatProgress(tests?.passed, tests?.total)}
    />
    <Stat.Item
      term="Failed tests"
      details={formatCount(tests?.failed)}
      criticality={criticality(tests?.failed)}
    />
    <Stat.Item term="Testing" details={formatCount(tests?.running)} />
  </Stat>
{/snippet}

{#snippet bugStats(counts?: BugCounts)}
  <Stat>
    <Stat.Item
      term="Open critical bugs"
      details={formatCount(counts?.critical)}
      criticality={criticality(counts?.critical)}
    />
    <Stat.Item term="Open bugs" details={formatCount(counts?.open)} />
    <Stat.Item term="In progress" details={formatCount(counts?.inProgress)} />
  </Stat>
{/snippet}

<div class={["series-stats", "subgrid", className]}>
  {#key `${distro}/${series}`}
    {#if distro === "ubuntu"}
      <svelte:boundary>
        {const imageCounts = $derived(
          await getSeriesStatsImageCounts({
            distro,
            series,
          }),
        )}
        {#if imageCounts}
          {@render imageStats(imageCounts)}
        {/if}

        {#snippet failed()}
          {@render imageStats()}
        {/snippet}
      </svelte:boundary>
    {/if}

    <svelte:boundary>
      {const bugCounts = $derived(await getSeriesBugCounts({ distro, series }))}
      {@render bugStats(bugCounts)}

      {#snippet failed()}
        {@render bugStats()}
      {/snippet}
    </svelte:boundary>
  {/key}
</div>

<style>
  .series-stats {
    row-gap: var(--space-200);
  }
</style>
