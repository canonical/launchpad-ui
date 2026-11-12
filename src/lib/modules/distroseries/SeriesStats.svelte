<script lang="ts">
  import type { ClassValue } from "svelte/elements";
  import { Stat } from "#lib/launchpad-components/index.js";
  import type { getSeriesBugCounts } from "./bugs/bugs.remote.js";
  import { NOT_DEFINED } from "./constants.js";
  import type { getSeriesImageCounts } from "./images/images.remote.js";

  type ImageCounts = NonNullable<
    Awaited<ReturnType<typeof getSeriesImageCounts>>
  >;
  type BugCounts = Awaited<ReturnType<typeof getSeriesBugCounts>>;

  let {
    imageCounts,
    bugCounts,
    class: className,
  }: {
    imageCounts?: ImageCounts | null;
    bugCounts: BugCounts | null;
    class?: ClassValue;
  } = $props();

  const builds = $derived(imageCounts?.building);
  const tests = $derived(imageCounts?.testing);
  const buildsHaveNoFailures = $derived(
    builds && builds.total > 0 && builds.failed === 0,
  );
  const testsHaveNoFailures = $derived(
    tests && tests.total > 0 && tests.failed === 0,
  );

  function formatCount(value: number | undefined, total?: number) {
    if (value === undefined) return "<cannot retrieve>";
    return total === 0 ? NOT_DEFINED : String(value);
  }

  function formatProgress(
    completed: number | undefined,
    total: number | undefined,
  ) {
    if (completed === undefined || total === undefined) {
      return "<cannot retrieve>";
    }
    return total === 0 ? NOT_DEFINED : `${completed}/${total}`;
  }
</script>

<div class={["series-stats", "subgrid", className]}>
  {#if imageCounts !== undefined}
    <Stat>
      <Stat.Item
        term="Images built"
        details={formatProgress(builds?.successful, builds?.total)} />
      <Stat.Item
        term="Failed to build"
        details={formatCount(builds?.failed, builds?.total)}
        criticality={buildsHaveNoFailures ? "success" : "error"} />
      <Stat.Item
        term="Building"
        details={formatCount(builds?.running, builds?.total)} />
    </Stat>
    <Stat>
      <Stat.Item
        term="Images passed tests"
        details={formatProgress(tests?.passed, tests?.total)} />
      <Stat.Item
        term="Failed tests"
        details={formatCount(tests?.failed, tests?.total)}
        criticality={testsHaveNoFailures ? "success" : "error"} />
      <Stat.Item
        term="Testing"
        details={formatCount(tests?.running, tests?.total)} />
    </Stat>
  {/if}
  <Stat>
    <Stat.Item
      term="Open critical bugs"
      details={formatCount(bugCounts?.critical)}
      criticality={bugCounts?.critical === 0 ? "success" : "error"} />
    <Stat.Item term="Open bugs" details={formatCount(bugCounts?.open)} />
    <Stat.Item
      term="In progress"
      details={formatCount(bugCounts?.inProgress)} />
  </Stat>
</div>

<style>
  .series-stats {
    row-gap: var(--space-200);
  }
</style>
