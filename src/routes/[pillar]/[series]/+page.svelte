<script lang="ts">
  import { ContentLayout } from "@canonical/svelte-ds-app";
  import { isHttpError } from "@sveltejs/kit";
  import {
    PageLayout,
    distroSegment,
  } from "#lib/launchpad-components/index.js";
  import GetInvolved from "#lib/modules/distroseries/GetInvolved.svelte";
  import SeriesHeader from "#lib/modules/distroseries/SeriesHeader.svelte";
  import SeriesMilestones from "#lib/modules/distroseries/SeriesMilestones.svelte";
  import SeriesStats from "#lib/modules/distroseries/SeriesStats.svelte";
  import { getSeriesBugCounts } from "#lib/modules/distroseries/bugs/bugs.remote.js";
  import SeriesImages from "#lib/modules/distroseries/images/SeriesImages.svelte";
  import { getSeriesImageCounts } from "#lib/modules/distroseries/images/images.remote.js";
  import { getSeriesOverview } from "#lib/modules/distroseries/series.remote.js";
  import type { PageProps } from "./$types.js";

  let { params }: PageProps = $props();

  /*
   * TODO: Remove `pillar` and `series`, and use `params` directly once
   * https://github.com/sveltejs/svelte/pull/19166 is released.
   *
   * A <svelte:boundary> that fails during SSR breaks hydration when it's nested
   * inside an `{#if}` block that WAITS on a script-level `await`. The page then
   * can't recover (https://github.com/sveltejs/svelte/issues/19213).
   *
   * The compiler makes any template code that reads `params` WAIT, because the
   * `await` below reads it. Now, the template reads these copies instead. Keep
   * `params` in the `await`, or the bug returns.
   */
  const pillar = $derived(params.pillar);
  const series = $derived(params.series);

  const seriesArgs = $derived({
    distro: params.pillar,
    series: params.series,
  });

  //TODO: revisit after data fixes https://warthogs.atlassian.net/browse/LP-5179
  const [overview, imageCounts, bugCounts] = $derived(
    await Promise.all([
      getSeriesOverview(seriesArgs),
      getSeriesImageCounts(seriesArgs)
        .then((counts) => counts ?? undefined)
        .catch(() => null),
      getSeriesBugCounts(seriesArgs).catch(() => null),
    ]),
  );

  const { displayName, status, description, links, milestones } =
    $derived(overview);
</script>

<svelte:head>
  <title>{displayName} - Launchpad</title>
</svelte:head>

<PageLayout
  breadcrumbsSegments={[distroSegment(params.pillar), { label: "Series" }]}>
  <div class="series-overview app">
    <ContentLayout grid="responsive">
      <SeriesHeader {displayName} {status} />

      <div class="overview subgrid">
        <section class="description" aria-label="About this series">
          <p>{description}</p>
        </section>

        <GetInvolved class="involvement" {links} />

        <SeriesMilestones
          class="milestones"
          {milestones}
          allMilestonesHref={links.milestones} />

        <SeriesStats class="stats" {imageCounts} {bugCounts} />
      </div>

      {#if pillar === "ubuntu"}
        <svelte:boundary>
          <SeriesImages {pillar} {series} />
          {#snippet failed(error)}
            <p class="images-error" role="alert">
              {isHttpError(error)
                ? error.body.message
                : error instanceof Error
                  ? error.message
                  : "Couldn't load Ubuntu Images."}
            </p>
          {/snippet}
        </svelte:boundary>
      {/if}
    </ContentLayout>
  </div>
</PageLayout>

<style>
  .series-overview {
    --grid-column-gap: var(--space-300);
  }

  .images-error {
    grid-column: 1 / -1;
  }

  .overview {
    row-gap: var(--space-300);
    padding-block-end: calc(var(--space-300) + var(--space-200));
    border-block-end: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

    > :global(*) {
      grid-column: 1 / -1;
    }
  }

  @media (min-width: 768px) {
    .overview {
      > :global(.description),
      > :global(.involvement) {
        grid-column: span 2;
      }

      > :global(.milestones) {
        grid-column: span 4;
      }

      > :global(.stats) {
        grid-column: 3 / -1;
      }
    }
  }

  @media (min-width: 1280px) {
    .overview {
      > :global(.description),
      > :global(.milestones) {
        grid-column: span 4;
      }

      > :global(.involvement) {
        grid-column: span 2;
      }

      > :global(.stats) {
        grid-column: span 6;
      }
    }
  }
</style>
