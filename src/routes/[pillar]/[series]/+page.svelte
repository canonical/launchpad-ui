<script lang="ts">
  import { ContentLayout } from "@canonical/svelte-ds-app";
  import type { PageProps } from "./$types.js";
  import GetInvolved from "./GetInvolved.svelte";
  import SeriesHeader from "./SeriesHeader.svelte";
  import SeriesMilestones from "./SeriesMilestones.svelte";
  import { getSeriesOverview } from "./series.remote.js";

  let { params }: PageProps = $props();

  const { displayName, status, description, links, milestones } = $derived(
    await getSeriesOverview({
      pillar: params.pillar,
      series: params.series,
    }),
  );
</script>

<svelte:head>
  <title>{displayName} - Launchpad</title>
</svelte:head>

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
        allMilestonesHref={links.milestones}
      />
    </div>
  </ContentLayout>
</div>

<style>
  .series-overview {
    --grid-column-gap: var(--space-300);
    container-type: inline-size;
    overflow-wrap: anywhere;
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
    }
  }

  @container (min-width: 940px) {
    .overview > :global(.involvement) {
      grid-column: span 1;
    }

    .overview > :global(.milestones) {
      grid-column: span 2;
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
    }
  }
</style>
